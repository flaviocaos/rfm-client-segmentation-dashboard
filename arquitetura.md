# Arquitetura do Projeto

Esta arquitetura foi projetada para realizar a análise de clientes com base em RFM (Recência, Frequência, Monetário), aplicar segmentação com KMeans e oferecer uma visualização interativa via Streamlit.

## 🔁 Fluxo de Dados e Componentes

1. **Entrada**:
   - `base_exemplo_compras.csv`: Base simulada contendo histórico de compras (cliente, data e valor).

2. **Processamento e Modelagem**:
   - `analise_rfm_clientes.ipynb`: Notebook que realiza o pré-processamento, cálculo RFM e clusterização com KMeans.
   - `exportar_rfm_com_clusters.py`: Script que automatiza a geração do CSV final `rfm_com_clusters.csv`.

3. **Saída**:
   - `rfm_com_clusters.csv`: Arquivo com os clientes segmentados por cluster.

4. **Visualização**:
   - `dashboard_rfm.py`: Painel interativo desenvolvido em Streamlit que permite:
     - Upload do arquivo CSV segmentado;
     - Filtro por clusters;
     - Geração de gráficos estatísticos.

## 📁 Estrutura de Arquivos

```
projeto_rfm/
├── base_exemplo_compras.csv           # Base de entrada
├── analise_rfm_clientes.ipynb         # Notebook de análise e clusterização
├── exportar_rfm_com_clusters.py       # Exportador de CSV com clusters
├── dashboard_rfm.py                   # Dashboard Streamlit
├── outputs/
│   └── rfm_com_clusters.csv           # Saída final processada
├── README.md
├── arquitetura.md
├── ...
```

## 🛠️ Tecnologias Utilizadas

- Python 3.x
- Pandas, Datetime (processamento)
- Scikit-Learn (machine learning)
- Streamlit (visualização)
- Matplotlib e Seaborn (gráficos)

---

Essa arquitetura é modular, reutilizável e ideal para integração com pipelines de dados mais complexos, podendo ser expandida para bancos de dados SQL, APIs REST, ou orquestradores como Airflow.
