const express = require('express');
const request = require('supertest');
const piscinaRoutes = require('../routes/piscina3Routes');
const piscinaService = require('../services/piscina3Service');

const app = express();
app.use(express.json());
app.use('/MOB3', piscinaRoutes);

// Teste de cálculo
describe('cálculo de piscina', () => {
  test('Calcula corretamente os valores', () => {
    const dados = {
      largura: 4,
      comprimento: 5,
      profundidade: 1.5,
      precoAgua: 4,
      custoEletrico: 1500,
      custoHidraulico: 1000,
      custoManutencaoMensal: 200
    };

    const resultado = piscinaService.calcularTodosCustos(dados);

    expect(resultado.volume).toBe('30.00 m³');
    expect(resultado.custoAgua).toBe('120.00');
    expect(resultado.custoConstrucao).toBe('2620.00');
    expect(resultado.manutencaoMensal).toBe('200.00');
  });
});

// Rota POST /login
describe(' rota POST /login', () => {
  test('Login com credenciais válidas retorna 200', async () => {
    const dadosLogin = {
      email: 'usuario1@email.com',
      senha: '123456'
    };

    const response = await request(app)
      .post('/MOB3/login')
      .send(dadosLogin)
      .expect(200);

    expect(response.body).toHaveProperty('token');
  });

  test('Login com credenciais inválidas retorna 401', async () => {
    const dadosLogin = {
      email: 'usuario@example.com',
      senha: 'senhaErrada'
    };

    const response = await request(app)
      .post('/MOB3/login')
      .send(dadosLogin)
      .expect(401);

    expect(response.body).toHaveProperty('erro');
    expect(response.body.erro).toBe('Usuário ou senha inválidos');
  });
});

// Rota POST /sobre
describe(' rota POST /sobre', () => {
  test('Retorna a URL da imagem corretamente', async () => {
    const response = await request(app)
      .post('/MOB3/sobre')
      .expect(200);

    expect(response.body).toHaveProperty('foto');
    expect(response.body.foto).toBe('https://sep-bucket-prod.s3.amazonaws.com/wp-content/uploads/2022/11/51981800313_fb744fd72d_o.jpg');
  });
});

// Rota POST /splash
describe(' rota POST /MOB3/splash', () => {
  test('Retorna sucesso e mensagem da splash screen', async () => {
    const response = await request(app)
      .post('/MOB3/splash')
      .expect(200);

    expect(response.body).toHaveProperty('sucesso', true);
    expect(response.body).toHaveProperty('mensagem', 'Splash screen carregada');
  });
});

// Rota GET /ajuda
describe(' rota GET /ajuda', () => {
  test('Retorna o texto de ajuda corretamente', async () => {
    const response = await request(app)
      .get('/MOB3/ajuda')
      .expect(200);

    expect(response.body).toHaveProperty('titulo', 'Ajuda');
    expect(response.body).toHaveProperty('texto');
    expect(response.body.texto).toMatch(/Preencha os dados/);
  });
});
