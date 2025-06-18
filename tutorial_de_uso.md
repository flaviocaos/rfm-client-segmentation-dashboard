# 📘 Tutorial de Uso – Segmentação de Clientes com RFM

Este tutorial orienta o uso completo da solução de análise RFM com clusterização e visualização interativa. Siga as etapas abaixo para obter insights sobre a base de clientes.

---

## ✅ Pré-Requisitos

- Python 3.8 ou superior
- Instale as dependências com:
```bash
pip install pandas matplotlib seaborn scikit-learn streamlit
```

---

## 🧭 Etapa 1 – Carregamento e Análise (via Notebook)

1. Abra o arquivo `analise_rfm_clientes.ipynb` em Jupyter Notebook ou VS Code.
2. Execute as células uma a uma:
   - Cálculo dos scores RFM (Recency, Frequency, Monetary)
   - Normalização dos dados
   - Aplicação do algoritmo KMeans
   - Visualização dos clusters (pairplot, estatísticas)
3. Revise os resultados gerados no próprio notebook.

---

## 🛠️ Etapa 2 – Geração do CSV com Clusters

1. Execute o script:
```bash
python exportar_rfm_com_clusters.py
```
2. Isso gerará o arquivo `rfm_com_clusters.csv` com os dados prontos para visualização.

> **Dica**: Certifique-se de que o arquivo `base_exemplo_compras.csv` está no mesmo diretório.

---

## 📊 Etapa 3 – Execução do Dashboard Streamlit

1. Inicie a aplicação com:
```bash
streamlit run dashboard_rfm.py
```
2. O navegador será aberto automaticamente com o painel interativo.

3. Faça upload do arquivo `rfm_com_clusters.csv` gerado na etapa anterior.

4. Explore:
   - Filtro por número do cluster
   - Gráficos estatísticos por segmento
   - Dispersão de comportamento de compra

---

## 🧩 Etapa 4 – Interpretação dos Resultados

Cada cliente estará atribuído a um **cluster numérico**, que representa um perfil de comportamento de compra.

| Cluster | Característica Comum Exemplo          |
|---------|----------------------------------------|
| 0       | Compradores frequentes e recentes (VIP)|
| 1       | Baixo valor, baixa frequência          |
| 2       | Clientes inativos ou em risco          |
| 3       | Alta frequência, valor mediano         |

> Os números dos clusters não seguem uma ordem fixa. A interpretação é feita com base nas médias dos grupos.

---

## ⚠️ Dúvidas Frequentes

- **O dashboard não inicia?** Verifique se o `streamlit` está instalado corretamente.
- **O CSV gerado não aparece no painel?** Certifique-se de que ele foi salvo no mesmo diretório do script Streamlit.
- **O notebook trava ao rodar o KMeans?** Confirme que há ao menos 10 clientes na base com compras.

---

## 🧪 Personalizações

- Altere `n_clusters` no código para modificar o número de grupos.
- Substitua `base_exemplo_compras.csv` por sua própria base real (respeitando o formato).
- Adapte a interface do dashboard para incorporar novas métricas ou gráficos.

---

Com esses passos, você poderá usar essa solução como ferramenta analítica poderosa para e-commerce, vendas B2B, fidelização de clientes e muito mais.
