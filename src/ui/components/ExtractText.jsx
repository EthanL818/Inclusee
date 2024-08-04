// src/ui/components/ExtractText.jsx
export const extractText = async (sandboxProxy) => {
    const textItems = await sandboxProxy.getText();
    console.log("Extracted Text Items:", textItems);
    return textItems;
  };
  