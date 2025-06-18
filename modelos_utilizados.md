# 🤖 Modelos e Técnicas Utilizadas

Este documento descreve os modelos e algoritmos utilizados no pipeline de segmentação de clientes baseado na metodologia RFM, bem como suas funções dentro do projeto.

---

## 📈 1. KMeans – Algoritmo de Clusterização

- **Biblioteca**: `scikit-learn`
- **Tipo**: Aprendizado não supervisionado
- **Objetivo**: Agrupar os clientes com base nos valores normalizados de Recência, Frequência e Monetário.
- **Justificativa**:
  - É simples, eficiente e amplamente utilizado para segmentação.
  - Permite identificar padrões em dados sem rótulos.
- **Parâmetros utilizados**:
  - `n_clusters=4`
  - `random_state=42`
  - `n_init='auto'`
- **Saída esperada**:
  - Atribuição de um número de cluster a cada cliente.

---

## 📊 2. StandardScaler – Normalização

- **Biblioteca**: `scikit-learn`
- **Função**: Escalar os dados de RFM para que cada atributo tenha média 0 e desvio padrão 1.
- **Justificativa**:
  - KMeans é sensível à escala dos dados — sem normalização, atributos com valores maiores dominariam a clusterização.
- **Aplicação**:
  - Os campos `Recency`, `Frequency` e `Monetary` são transformados antes de aplicar o modelo KMeans.

---

## 🧠 3. Lógica RFM (Recency, Frequency, Monetary)

- **Metodologia clássica de marketing** baseada em:
  - **Recency (R)**: tempo desde a última compra.
  - **Frequency (F)**: número total de compras.
  - **Monetary (M)**: valor total gasto.
- **Aplicação no projeto**:
  - Esses três indicadores são calculados para cada cliente e utilizados como base para o modelo de clusterização.

---

## 🛠️ Considerações Finais

- O pipeline pode ser facilmente ajustado para usar outros algoritmos como DBSCAN, Gaussian Mixture Models ou Hierarchical Clustering, caso necessário.
- O modelo atual foca em simplicidade, performance e clareza interpretativa, sendo ideal para MVPs e dashboards analíticos.

---

Este modelo é adequado para análise comportamental de clientes em e-commerce, varejo, SaaS e outras verticais.
