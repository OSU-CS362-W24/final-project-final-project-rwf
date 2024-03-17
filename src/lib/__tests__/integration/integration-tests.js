/**
* @jest-environment jsdom
*/

require("@testing-library/jest-dom");
const domTesting = require("@testing-library/dom");
const userEvent = require("@testing-library/user-event").default;

const fs = require("fs");

function initDOMFromFiles(htmlPath, jsPath){
   const html = fs.readFileSync(htmlPath, 'utf8')
   document.open();
   document.write(html);
   document.close();

   jest.isolateModules(() =>{
       require(jsPath);
   });
}

test("Adding values in the chart builder works correctly", async function () {
   const user = userEvent.setup();

   initDOMFromFiles(
       `${__dirname}/../../../line/line.html`, `${__dirname}/../../../line/line.js`
   );

   xInputs = domTesting.getAllByLabelText(document, "X");
   yInputs = domTesting.getAllByLabelText(document, "Y");
   const addButton = domTesting.getByText(document, "+");

   await userEvent.type(xInputs[0], "1");
   await userEvent.type(yInputs[0], "2");
   await userEvent.click(addButton);
   
   xInputs = domTesting.getAllByLabelText(document, "X");
   yInputs = domTesting.getAllByLabelText(document, "Y");

   await userEvent.type(xInputs[1], "3");
   await userEvent.type(yInputs[1], "4");
   await userEvent.click(addButton);

   xInputs = domTesting.getAllByLabelText(document, "X");
   yInputs = domTesting.getAllByLabelText(document, "Y");

   expect(xInputs[0].value).toBe("1");
   expect(yInputs[0].value).toBe("2");
   expect(xInputs[1].value).toBe("3");
   expect(yInputs[1].value).toBe("4");
   expect(xInputs[2].value).toBe("");
   expect(yInputs[2].value).toBe("");
});