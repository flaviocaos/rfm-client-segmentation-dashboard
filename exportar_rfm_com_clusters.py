
import pandas as pd
from datetime import timedelta
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans

# Carregar base de dados
df = pd.read_csv('base_exemplo_compras.csv', parse_dates=['purchase_date'])

# Calcular data de referência
reference_date = df['purchase_date'].max() + timedelta(days=1)

# Calcular RFM
rfm = df.groupby('customer_id').agg({
    'purchase_date': lambda x: (reference_date - x.max()).days,
    'customer_id': 'count',
    'purchase_value': 'sum'
}).rename(columns={
    'purchase_date': 'Recency',
    'customer_id': 'Frequency',
    'purchase_value': 'Monetary'
}).reset_index()

# Padronizar
scaler = StandardScaler()
rfm_scaled = scaler.fit_transform(rfm[['Recency', 'Frequency', 'Monetary']])

# KMeans
kmeans = KMeans(n_clusters=4, random_state=42, n_init='auto')
rfm['Cluster'] = kmeans.fit_predict(rfm_scaled)

# Exportar para CSV
rfm.to_csv('rfm_com_clusters.csv', index=False)
print("Arquivo salvo como 'rfm_com_clusters.csv'")
