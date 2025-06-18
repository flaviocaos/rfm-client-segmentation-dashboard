# 🔄 Fluxo de Trabalho - Análise RFM e Clusterização

Este documento descreve o fluxo completo de trabalho do projeto, desde a ingestão da base de dados até a visualização final dos resultados.

---

## 🧩 Etapas do Pipeline

### 1. 🗃️ Ingestão de Dados
- **Arquivo de entrada**: `base_exemplo_compras.csv`
- **Conteúdo**: histórico de compras por cliente (ID, data da compra e valor).
- **Formato**: CSV, delimitado por vírgulas, com datas no padrão `YYYY-MM-DD`.

---

### 2. 🧮 Processamento e Análise
- **Script/Notebook**: `analise_rfm_clientes.ipynb`
- **Etapas executadas**:
  - **Cálculo da Recência (R)**: dias desde a última compra.
  - **Cálculo da Frequência (F)**: número de compras realizadas.
  - **Cálculo do Valor Monetário (M)**: soma total dos valores comprados.
  - **Padronização**: normalização dos dados com `StandardScaler`.
  - **Clusterização**: agrupamento com `KMeans` para identificar perfis de clientes.

---

### 3. 📝 Geração do Dataset Final
- **Script**: `exportar_rfm_com_clusters.py`
- **Saída**: `rfm_com_clusters.csv`
- **Conteúdo**: cada cliente com seus scores RFM e o cluster ao qual pertence.

---

### 4. 📊 Visualização Interativa
- **Aplicação**: `dashboard_rfm.py` via Streamlit
- **Funcionalidades**:
  - Upload do arquivo de saída com clusters.
  - Filtro por grupo de clientes.
  - Visualização de gráficos estatísticos por cluster:
    - Boxplots (Recency, Monetary)
    - Histogramas (Frequency)
    - Dispersões (Frequency x Monetary)

---

## 📂 Artefatos Gerados

| Artefato                  | Descrição                                     |
|---------------------------|-----------------------------------------------|
| `base_exemplo_compras.csv` | Base inicial de transações simuladas          |
| `rfm_com_clusters.csv`     | Resultado final com clientes segmentados      |
| `analise_rfm_clientes.ipynb` | Pipeline RFM + KMeans para desenvolvimento   |
| `dashboard_rfm.py`         | Painel visual para análise interativa         |

---

## 🔁 Reusabilidade

Este fluxo é modular e pode ser adaptado para:
- Novos datasets com o mesmo formato.
- Integração com pipelines de ETL automatizados.
- Substituição do KMeans por modelos mais sofisticados (DBSCAN, GMM etc).

---

Esse fluxo foi desenhado para ser simples, claro e facilmente replicável em ambientes corporativos ou acadêmicos.
