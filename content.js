// Content script function to extract text from elements with 'content' class
function extractContentToFile() {
  try {
    // Find the parent element (defaults to body if not specified)
    const parentElement = document.querySelector(".annotations");
    
    if (!parentElement) {
      console.error('Parent element not found:', parentSelector);
      return;
    }
    
    // Find all children with class 'content'
    const contentElements = parentElement.querySelectorAll('.content');
    
    if (contentElements.length === 0) {
      console.warn('No elements with class "content" found');
      return;
    }
    
    // Extract innerText from each element
    const extractedText = Array.from(contentElements)
      .map((element, index) => {
        const text = element.innerText.trim();
        return `Content ${index + 1}:\n${text}\n`;
      })
      .join('\n---\n\n');
    
    // Create the final content with metadata
    const finalContent = `Content extracted from: ${window.location.href}\n` +
                        `Date: ${new Date().toISOString()}\n` +
                        `Total elements found: ${contentElements.length}\n\n` +
                        `${'='.repeat(50)}\n\n` +
                        extractedText;
    
    // Create and download the file
    downloadTextFile(finalContent, 'extracted-content.txt');
    
    console.log(`Successfully extracted ${contentElements.length} content elements`);
    
  } catch (error) {
    console.error('Error extracting content:', error);
  }
}

// Helper function to create and download a text file
function downloadTextFile(content, filename) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  URL.revokeObjectURL(url);
}

// Example usage:
// Extract from all elements with class 'content' under body
// extractContentToFile();

// Extract from elements with class 'content' under a specific parent
// extractContentToFile('#main-container');
// extractContentToFile('.article-wrapper');

// You can also call this function from a popup or background script
// by injecting it into the active tab

// Function to add download button to toolbar
function addDownloadBtn() {
  try {
    // Find the toolbar end element
    const endElement = document.querySelector('.toolbar .end');
    
    if (!endElement) {
      console.error('Toolbar end element not found');
      return;
    }
    
    // Check if button already exists to avoid duplicates
    if (document.querySelector('#content-download-btn')) {
      console.log('Download button already exists');
      return;
    }
    
    // Create the download button
    const downloadButton = document.createElement('button');
    downloadButton.id = 'content-download-btn';
    downloadButton.style.cssText = `
      width: 28px;
      height: 28px;
      margin-right: 8px;
      background: transparent;
      border: 1px solid #ccc;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      transition: background-color 0.2s ease;
      flex-shrink: 0;
    `;
    
    // Add hover effect
    downloadButton.addEventListener('mouseenter', () => {
      downloadButton.style.backgroundColor = '#f0f0f0';
    });
    
    downloadButton.addEventListener('mouseleave', () => {
      downloadButton.style.backgroundColor = 'transparent';
    });
    
    // Create download icon (SVG)
    downloadButton.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7,10 12,15 17,10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
    `;
    
    // Add click event listener
    downloadButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Add visual feedback
      downloadButton.style.backgroundColor = '#e0e0e0';
      setTimeout(() => {
        downloadButton.style.backgroundColor = 'transparent';
      }, 150);
      
      // Call the content extraction function
      extractContentToFile();
    });
    
    // Add tooltip
    downloadButton.title = 'Download content as text file';
    
    // Insert the button as the first child of the end element
    endElement.insertBefore(downloadButton, endElement.firstChild);
    
    console.log('Download button added to toolbar');
    
  } catch (error) {
    console.error('Error adding download button:', error);
  }
}

window.addEventListener("load", () => {
  addDownloadBtn()
})