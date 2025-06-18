# Imagem base
FROM python:3.8-slim

# Diretório de trabalho no container
WORKDIR /app

# Copiar arquivos do projeto
COPY . /app

# Instalar dependências
RUN pip install --upgrade pip \
    && pip install -r requirements.txt

# Expor a porta padrão do Streamlit
EXPOSE 8501

# Comando de execução padrão
CMD ["streamlit", "run", "dashboard_rfm.py", "--server.enableCORS=false"]
