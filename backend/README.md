# 🛍️ E-Commerce API

> Uma API REST de e-commerce que construí para demonstrar minhas habilidades com desenvolvimento backend moderno.

## 📖 Sobre o Projeto

Olá! Eu criei esta API como parte do meu portfólio para mostrar como penso e trabalho com desenvolvimento backend. É uma API de e-commerce completa, mas o mais importante aqui não é o produto em si - é como tudo foi construído, organizado e pensado.

**O que essa API faz?**  
Basicamente, permite gerenciar produtos e usuários de uma loja virtual, com controle de quem pode fazer o quê (usuários comuns vs administradores). Tudo protegido por autenticação e pronto para uso em produção.

## 🚀 Tecnologias que Usei

Aqui estão as principais ferramentas que escolhi e por quê:

| Tecnologia | Por que usei |
|------------|--------------|
| **FastAPI** | Framework moderno, super rápido e com documentação automática. Economiza horas de trabalho manual |
| **PostgreSQL** | Banco de dados robusto e confiável - escolhi ele pensando em escalabilidade |
| **SQLAlchemy** | O "canivete suíço" para banco de dados no Python. Me dá flexibilidade sem perder performance |
| **JWT** | Autenticação segura e stateless. Padrão da indústria |
| **Docker** | Para rodar em qualquer lugar sem o famoso "mas na minha máquina funciona" |
| **Pytest** | Testes automatizados. Porque código sem teste é só um palpite que funciona |
| **Render** | Deploy em produção. Mostra que sei levar software para o mundo real |

## 🎯 O Que Eu Demonstro com Este Projeto

✅ **Arquitetura limpa** - Separação clara de responsabilidades (rotas, modelos, schemas, lógica de negócio)  
✅ **Preocupação com segurança** - Senhas hasheadas, JWT, permissões de usuário  
✅ **Código testável** - Testes que realmente testam comportamentos importantes  
✅ **Documentação viva** - Swagger/ReDoc gerados automaticamente  
✅ **Preparado para produção** - Variáveis de ambiente, Docker, deploy automatizado  
✅ **Tratamento de erros** - Mensagens claras e status HTTP apropriados  
✅ **Boas práticas REST** - Verbos HTTP, status codes, endpoints intuitivos  

## 📚 Endpoints Principais

Método	Endpoint	        O que faz	          Quem pode
POST	/api/register	    Criar conta	          Todos
POST	/api/token	        Login (recebe JWT)	  Todos
GET	    /api/products/	    Listar produtos	      Todos (autenticados)
POST	/api/products/	    Criar produto	      Admin
PUT	    /api/products/{id}	Atualizar produto	  Admin
DELETE	/api/products/{id}	Remover produto	      Admin
GET	    /api/users/me	    Meu perfil	          Usuário logado
GET	    /api/users/	        Listar usuários	      Apenas admin
