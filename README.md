# RFM Client Segmentation Dashboard

Este repositório apresenta uma solução completa para análise e segmentação de clientes com base na metodologia RFM (Recência, Frequência, Monetário), utilizando algoritmos de machine learning (KMeans) para clusterização e um painel interativo em Streamlit para visualização dos resultados.

---

## 📌 Objetivo

O projeto tem como objetivo permitir que analistas, profissionais de marketing, vendas e ciência de dados possam:
- Identificar perfis comportamentais de clientes com base no histórico de compras.
- Agrupar automaticamente os clientes em segmentos (VIPs, em risco, inativos, leais, etc).
- Apoiar a tomada de decisões estratégicas com foco em retenção, fidelização e aumento do ticket médio.

---

## ⚙️ Tecnologias e Ferramentas

- **Python 3.x**
- **Pandas** e **Datetime**: manipulação de dados e cálculo dos scores RFM.
- **Scikit-Learn**: normalização com StandardScaler e clusterização com KMeans.
- **Seaborn** e **Matplotlib**: geração de gráficos estatísticos.
- **Streamlit**: criação de dashboard interativo para visualização dos clusters.

---

## 🧪 Metodologia

1. **Leitura da base de compras** com campos: `customer_id`, `purchase_date`, `purchase_value`.
2. **Cálculo dos scores RFM**:
   - `Recency`: dias desde a última compra.
   - `Frequency`: número de compras por cliente.
   - `Monetary`: valor total gasto pelo cliente.
3. **Normalização dos dados** com `StandardScaler`.
4. **Clusterização não supervisionada** com `KMeans`, agrupando os clientes em segmentos comportamentais.
5. **Geração de visualizações** para interpretar o comportamento de cada cluster.
6. **Painel interativo** com filtro por cluster, gráficos dinâmicos e análise exploratória.

---

## 🖥️ Como Utilizar

### 1. Instale as dependências:
```bash
pip install pandas matplotlib seaborn scikit-learn streamlit
```

### 2. Execute o script para processar os dados:
```bash
python exportar_rfm_com_clusters.py
```

### 3. Inicie o dashboard:
```bash
streamlit run dashboard_rfm.py
```

---

## 📂 Estrutura do Repositório

```
📦 rfm-client-segmentation-dashboard/
├── base_exemplo_compras.csv           # Base de dados simulada
├── analise_rfm_clientes.ipynb         # Notebook com o pipeline de análise
├── exportar_rfm_com_clusters.py       # Script para gerar o CSV final
├── dashboard_rfm.py                   # Dashboard em Streamlit
├── 📄 README.md                        # Este arquivo
├── 📄 arquitetura.md                  # Descrição técnica da arquitetura
├── 📄 dicionario_de_dados.md         # Glossário dos campos utilizados
├── 📄 tutorial_de_uso.md             # Guia passo a passo para uso
├── 📄 fluxo_de_trabalho.md           # Representação do pipeline
├── 📄 mapa_de_componentes.md         # Visão modular dos componentes
├── 📄 modelos_utilizados.md          # Algoritmos e técnicas de ML
├── 📄 security.md                     # Cuidados com dados sensíveis
├── 📄 CONTRIBUTING.md                 # Guia para contribuidores
└── 📄 .gitignore                      # Arquivos a serem ignorados
```

---

## 📊 Exemplos de Uso

- Identificar clientes com alto potencial de retorno (VIPs).
- Detectar perfis em risco de abandono (churn).
- Apoiar campanhas de e-mail marketing segmentado.
- Analisar padrões de consumo por cluster e por tempo.

---

## 🔒 Boas Práticas de Segurança

Este projeto não deve ser utilizado com dados sensíveis em produção sem anonimização prévia. Certifique-se de seguir as orientações no arquivo `security.md`.

---

## 🤝 Contribuições

Sinta-se à vontade para propor melhorias via fork e pull request. Veja as diretrizes no arquivo `CONTRIBUTING.md`.

---

## 📜 Licença

Este projeto pode ser utilizado para fins educacionais, acadêmicos ou corporativos, desde que citada a fonte.

![Python Version](https://img.shields.io/badge/python-3.8%2B-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-estável-brightgreen)
![Contributions](https://img.shields.io/badge/contributions-bem%20vindas-blueviolet)
![Streamlit](https://img.shields.io/badge/streamlit-1.10%2B-ff4b4b)

