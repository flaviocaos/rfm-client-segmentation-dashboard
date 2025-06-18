# 📘 Dicionário de Dados

Este dicionário descreve os campos utilizados nos datasets `base_exemplo_compras.csv` e `rfm_com_clusters.csv`, utilizados ao longo do processo de análise RFM e clusterização.

---

## 🧾 Dados de Entrada (`base_exemplo_compras.csv`)

| Campo           | Tipo      | Descrição                                                                 |
|-----------------|-----------|---------------------------------------------------------------------------|
| `customer_id`   | string    | Identificador único do cliente. Não deve se repetir entre clientes distintos. |
| `purchase_date` | date      | Data da transação ou compra realizada. Deve estar no formato `YYYY-MM-DD`. |
| `purchase_value`| float     | Valor monetário da compra realizada. Representado em unidades da moeda vigente. |

---

## 📊 Dados Processados (`rfm_com_clusters.csv`)

| Campo         | Tipo    | Descrição                                                                 |
|---------------|---------|---------------------------------------------------------------------------|
| `customer_id` | string  | Mesmo ID do cliente conforme registrado na base de entrada.              |
| `Recency`     | integer | Quantidade de dias desde a última compra do cliente até a data de referência da análise. |
| `Frequency`   | integer | Total de compras realizadas pelo cliente no período avaliado.           |
| `Monetary`    | float   | Soma total dos valores das compras realizadas pelo cliente.              |
| `Cluster`     | integer | Número do grupo ao qual o cliente pertence, gerado via algoritmo KMeans. |

---

## 🔎 Notas Adicionais

- O campo `Cluster` não é ordinal: os números (0, 1, 2, ...) representam grupos, mas não indicam grau ou hierarquia.
- A data de referência (`reference_date`) utilizada para cálculo de `Recency` é o dia seguinte à última data presente na base (`purchase_date.max() + 1 dia`).
- O dataset final pode conter **insights valiosos** como:
  - Clientes mais ativos (`Recency` baixo, `Frequency` alta);
  - Clientes de maior valor (`Monetary` alto);
  - Clientes em risco (`Recency` alto, `Frequency` baixa).

---

Este dicionário deve ser mantido atualizado sempre que novos campos forem adicionados ou alterados no pipeline de dados.
