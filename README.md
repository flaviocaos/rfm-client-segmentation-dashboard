# Análise RFM com Clusterização

Este projeto realiza a análise de clientes utilizando a metodologia RFM (Recência, Frequência, Monetário) com clusterização KMeans. Os dados são visualizados via dashboard interativo em Streamlit.

## Componentes

- `analise_rfm_clientes.ipynb`: Notebook para calcular RFM e aplicar KMeans.
- `dashboard_rfm.py`: Dashboard interativo com filtros e visualização de clusters.
- `exportar_rfm_com_clusters.py`: Script para gerar o CSV final com clusters.
- `base_exemplo_compras.csv`: Base de dados exemplo para testes.

## Requisitos

```bash
pip install pandas matplotlib seaborn scikit-learn streamlit
```

## Execução

```bash
streamlit run dashboard_rfm.py
```
