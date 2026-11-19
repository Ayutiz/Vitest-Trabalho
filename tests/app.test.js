
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';

process.env.DB_STORAGE = ':memory:';

const app = require('../app');
const bd = require('../config/bd');
const models = require('../models');

beforeAll(async () => {
    await bd.sync({ force: true });
});

beforeEach(async () => {
    await models.Consulta.destroy({ where: {} });
    await models.Medico.destroy({ where: {} });
    await models.Paciente.destroy({ where: {} });
    await models.Especialidade.destroy({ where: {} });
});

afterAll(async () => {
    await bd.close();
});

describe('Rotas principais', () => {
    it('deve acessar a página inicial', async () => {
        const response = await request(app).get('/');

        expect(response.status).toBe(200);
        expect(response.text).toContain('Sistema Hospitalar');
    });
});

describe('Médicos', () => {
    it('deve cadastrar um médico', async () => {
        const especialidade = await models.Especialidade.create({
            descricao: 'Cardiologia'
        });

        const response = await request(app)
            .post('/medico')
            .type('form')
            .send({
                nome: 'Carlos',
                especialidades: [especialidade.id]
            });

        expect(response.status).toBe(302);

        const medico = await models.Medico.findOne({
            where: { nome: 'Carlos' }
        });

        expect(medico).not.toBeNull();
    });

    it('deve listar médicos cadastrados', async () => {
        await models.Medico.create({ nome: 'João' });

        const response = await request(app).get('/medico');

        expect(response.status).toBe(200);
        expect(response.text).toContain('João');
    });

    it('deve apresentar o formulário de cadastro', async () => {
        const response = await request(app).get('/medico/novo');

        expect(response.status).toBe(200);
    });
});

describe('Especialidades', () => {
    it('deve cadastrar uma especialidade', async () => {
        const response = await request(app)
            .post('/especialidade')
            .type('form')
            .send({ descricao: 'Neurologia' });

        expect(response.status).toBe(302);

        const especialidade = await models.Especialidade.findOne({
            where: { descricao: 'Neurologia' }
        });

        expect(especialidade).not.toBeNull();
    });

    it('deve listar especialidades', async () => {
        await models.Especialidade.create({
            descricao: 'Pediatria'
        });

        const response = await request(app).get('/especialidade');

        expect(response.status).toBe(200);
        expect(response.text).toContain('Pediatria');
    });
});

describe('Pacientes', () => {
    it('deve cadastrar paciente e prontuário', async () => {
        const response = await request(app)
            .post('/paciente')
            .type('form')
            .send({
                nome: 'Maria',
                descricao: 'Paciente em acompanhamento'
            });

        expect(response.status).toBe(302);

        const paciente = await models.Paciente.findOne({
            where: { nome: 'Maria' },
            include: ['prontuario']
        });

        expect(paciente).not.toBeNull();
        expect(paciente.prontuario.descricao)
            .toBe('Paciente em acompanhamento');
    });

    it('deve listar pacientes e seus prontuários', async () => {
        await models.Paciente.create({
            nome: 'Ana',
            prontuario: {
                descricao: 'Consulta de rotina'
            }
        }, {
            include: ['prontuario']
        });

        const response = await request(app).get('/paciente');

        expect(response.status).toBe(200);
        expect(response.text).toContain('Ana');
        expect(response.text).toContain('Consulta de rotina');
    });
});

describe('Consultas', () => {
    it('deve cadastrar uma consulta', async () => {
        const paciente = await models.Paciente.create({
            nome: 'Pedro'
        });

        const medico = await models.Medico.create({
            nome: 'Roberto'
        });

        const response = await request(app)
            .post('/consulta')
            .type('form')
            .send({
                pacienteId: paciente.id,
                medicoId: medico.id,
                hora: 14
            });

        expect(response.status).toBe(302);

        const consulta = await models.Consulta.findOne({
            where: {
                pacienteId: paciente.id,
                medicoId: medico.id
            }
        });

        expect(consulta).not.toBeNull();
        expect(consulta.hora).toBe(14);
    });

    it('deve listar consultas com médico e paciente', async () => {
        const paciente = await models.Paciente.create({
            nome: 'Fernanda'
        });

        const medico = await models.Medico.create({
            nome: 'Marcos'
        });

        await models.Consulta.create({
            hora: 10,
            pacienteId: paciente.id,
            medicoId: medico.id
        });

        const response = await request(app).get('/consulta');

        expect(response.status).toBe(200);
        expect(response.text).toContain('Fernanda');
        expect(response.text).toContain('Marcos');
        expect(response.text).toContain('10');
    });

    it('deve apresentar o formulário de cadastro', async () => {
        const response = await request(app).get('/consulta/novo');

        expect(response.status).toBe(200);
    });
});
