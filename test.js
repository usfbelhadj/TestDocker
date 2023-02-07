const firefox = require('selenium-webdriver/firefox');
const {Builder, By} = require('selenium-webdriver');
const {NoSuchElementError, checkLegacyResponse} = require('selenium-webdriver/lib/error')
const fs = require('fs');
const { stdout } = require('process');

const screen = {
  width: 1920,
  height: 1080
};

let driver = new Builder()
    .forBrowser('firefox')
    .setFirefoxOptions(new firefox.Options().headless().windowSize(screen))
    .build();
(async function main(driver) {
    
    try {
        let valid = true;
        await driver.get('http://localhost:3000');

        // Wait for the App-header Class to be displayed

        console.log("Processing first Class Name ...")

        let firstClassName = await driver.findElement(By.className("App-header"))
        
        if(firstClassName === null){
            valid = false;
        }
        let allTagsInsideFirstClass = await firstClassName.findElements(By.xpath("./child::*"))

        for(let i of allTagsInsideFirstClass){
            let tagsInsideFirstClass =  (await i.getTagName())
            if(tagsInsideFirstClass !== 'h1' && tagsInsideFirstClass !== 'img'){
                valid = false;
            }
        }
        let firstclassAttribute =  (await driver.findElement(By.css("h1")).getText()).toLowerCase();
        if(firstclassAttribute !== 'school dashboard'){
            valid = false;
        }

        let secondclassAttribute =  (await driver.findElement(By.css("img")).getAttribute("src"));
        if(!secondclassAttribute.includes('jpg')){
            valid = false;
        }


        let cssfirstClass = await driver.findElement(By.className("App-header")).getCssValue("border-bottom")


        // Second Class Name 
        let secondClassName = await driver.findElement(By.className("App-body"))
        
        if(secondClassName === null){
            valid = false;
        }

        let allTagsInsideSecondClass = await secondClassName.findElements(By.xpath("./child::*"))

        for(let i of allTagsInsideSecondClass){
            let tagsInsideSecondClass =  (await i.getTagName())
           
            if(tagsInsideSecondClass !== 'p' && (await tagsInsideSecondClass.getText).toLowerCase() !== 'login to access the full dashboard'){
                valid = false;
            }
        }

        let cssSecondClass1 = await driver.findElement(By.className("App-body")).getCssValue("border-top")
        let cssSecondClass2 = await driver.findElement(By.className("App-body")).getCssValue("border-bottom")


        // Third Class Name 
        let thirdClassName = await driver.findElement(By.className("App-footer"))
        
        if(thirdClassName === null){
            valid = false;
        }

        let allTagsInsideThirdClass = await thirdClassName.findElements(By.xpath("./child::*"))

        for(let i of allTagsInsideThirdClass){
            let tagsInsideThirdClass =  (await i.getTagName())
            
            if(tagsInsideThirdClass !== 'p' && (await tagsInsideThirdClass.getText).toLowerCase() !== 'copyright 2020 - holberton school'){
                valid = false;
            }
        }
        // Testing border

        let cssthirdClass = await driver.findElement(By.className("App-footer")).getCssValue("border-top")
        if((cssthirdClass === null)  || (cssSecondClass1 === null && cssSecondClass2 === null)  || (cssfirstClass === null) ){
            valid = false;
        }

        if(valid)process.stdout.write("OK");
    }catch (err) {
            if (err instanceof NoSuchElementError) {
                console.log(err.message);
                valid = false
            } 
        else{process.stdout.write(err.message);}
        
    } finally {
        await driver.quit();
    }
})(driver);

