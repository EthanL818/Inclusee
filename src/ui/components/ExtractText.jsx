// src/ui/components/ExtractText.jsx
export const extractText = async (sandboxProxy) => {
    const textItems = await sandboxProxy.getText();
    const currentPage = await sandboxProxy.getCurrentPage();
  
    console.log("Text Items:", textItems);
    console.log("Current Page:", currentPage);
  
    const textItemsWithPage = textItems.map(item => ({
      ...item,
      page: item.page || currentPage // Add page information
    }));
  
    console.log("Extracted Text Items with Page Info:", textItemsWithPage);
    return textItemsWithPage;
  };
   