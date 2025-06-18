# 🐳 Uso de Docker no Projeto RFM Dashboard

Este documento explica como utilizar Docker e Docker Compose para executar o projeto de análise de clientes com RFM e visualização via Streamlit de forma containerizada.

---

## 📦 O que está incluso

- `Dockerfile`: define a imagem com Python, dependências e o Streamlit configurado.
- `docker-compose.yml`: orquestra o container e mapeia a porta local.

---

## ⚙️ Requisitos

- Docker instalado: [Instruções para instalar](https://docs.docker.com/get-docker/)
- Docker Compose (geralmente incluído nas versões atuais do Docker)

---

## ▶️ Instruções de Uso

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/rfm-client-segmentation-dashboard.git
cd rfm-client-segmentation-dashboard
```

### 2. Construa a imagem do Docker
```bash
docker-compose build
```

### 3. Inicie a aplicação
```bash
docker-compose up
```

### 4. Acesse no navegador
Abra o endereço:
```
http://localhost:8501
```

---

## 🛠️ O que o Docker faz

- Cria um ambiente isolado com Python 3.8.
- Instala todas as dependências listadas no `requirements.txt`.
- Roda o `dashboard_rfm.py` via Streamlit.
- Mapeia a porta `8501` do container para sua máquina local.

---

## 🧼 Finalizando

Para parar a aplicação:
```bash
docker-compose down
```

Para remover containers/parar tudo:
```bash
docker system prune -a
```

---

## 📁 Estrutura esperada

```
📦 rfm-client-segmentation-dashboard/
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── dashboard_rfm.py
├── exportar_rfm_com_clusters.py
└── ...
```

---

Este setup permite que qualquer pessoa execute o projeto em segundos, sem precisar instalar Python ou bibliotecas localmente.
