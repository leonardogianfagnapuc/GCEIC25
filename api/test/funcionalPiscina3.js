const { Builder, By, Key, until } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  fs.mkdirSync(dirname, { recursive: true });
}

const screenshotsDir = path.join(__dirname, '..', 'fotos', 'mob3');

(async () => {
  const screen = { width: 1024, height: 720 };
  const chromeOptions = new Options();
  chromeOptions.addArguments('--headless');
  chromeOptions.addArguments('--no-sandbox');
  chromeOptions.windowSize(screen);

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(chromeOptions)
    .build();

  try {
    console.log('Abrindo site');
    await driver.get('https://sergio.dev.br/');
    await driver.sleep(5000);

    try {
      console.log("Esperando botão MOB3 aparecer...");
      const mob3Button = await driver.wait(
        until.elementLocated(By.xpath("//flt-semantics[text()='MOB3']")),
        15000
      );
      await driver.wait(until.elementIsVisible(mob3Button), 5000);
      console.log("Clicando em MOB3");
      await mob3Button.click();
    } catch (e) {
      console.error("Erro ao tentar clicar em MOB3:", e);
    }

    console.log('Aguardando 5 segundos para splash screen...');
    await driver.sleep(5000);
    await takeScreenshot(driver, 'splash_screen.png');

    console.log('Aguardando mais 5 segundos para a tela de login...');
    await driver.sleep(5000);
    await takeScreenshot(driver, 'login_tela.png');

    const inputs = await driver.findElements(By.css('textarea, input, [contenteditable="true"]'));
    await inputs[0].sendKeys('usuario1@email.com');
    await inputs[1].sendKeys('123456');

    console.log("Esperando botão Ajuda aparecer...");
    const ajudaBtnA = await driver.wait(
      until.elementLocated(By.xpath("//flt-semantics[text()='Ajuda']")),
      15000
    );
    await driver.wait(until.elementIsVisible(ajudaBtnA), 5000);
    console.log("Clicando em Ajuda");
    await ajudaBtnA.click();
    await takeScreenshot(driver, 'menu_ajuda.png');



    // Ajuda
    const ajudaBtn = await driver.findElement(By.xpath("//flt-semantics[text()='Ajuda']"));
    await ajudaBtn.click();
    await driver.sleep(3000);
    await takeScreenshot(driver, 'tela_ajuda.png');
    await driver.navigate().back();
    await driver.sleep(3000);

    // Sobre
    const sobreBtn = await driver.findElement(By.xpath("//flt-semantics[text()='Sobre']"));
    await sobreBtn.click();
    await driver.sleep(3000);
    await takeScreenshot(driver, 'tela_sobre.png');
    await driver.navigate().back();
    await driver.sleep(3000);

    // Consultar
    const consultarBtn = await driver.findElement(By.xpath("//flt-semantics[text()='Consulta Piscina']"));
    await consultarBtn.click();
    await driver.sleep(3000);
    await takeScreenshot(driver, 'tela_consultar.png');

    console.log('Testes finalizados com sucesso.');

  } catch (err) {
    console.error('Erro durante os testes:', err);
  } finally {
    await driver.quit();
  }

  async function takeScreenshot(driver, fileName) {
    const image = await driver.takeScreenshot();
    const filePath = path.join(screenshotsDir, fileName);
    ensureDirectoryExistence(filePath);
    fs.writeFileSync(filePath, image, 'base64');
    console.log(`Screenshot salva em: ${filePath}`);
  }
})();
