export const parseCSV = (file, callback) => {
  if (!(file instanceof Blob)) {
    console.error("❌ parseCSV: provided input is not a valid file. It should come from <input type='file'>.");
    return;
  }

  const reader = new FileReader();

  reader.onload = (event) => {
    const text = event.target.result;

    // Handle both \r\n (Windows) and \n (Mac/Linux)
    const rows = text.split(/\r?\n/).map(r => r.trim()).filter(Boolean);

    // Skip first row (header)
    const data = rows.slice(1).map(row => {
      const values = row.split(/,|\t/).map(v => v.trim());
      while (values.length && values[values.length - 1] === '') values.pop();
      return values;
    });

    callback(data);
  };

  reader.readAsText(file);
};
