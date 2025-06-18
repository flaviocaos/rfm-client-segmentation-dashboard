
import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Configuração
st.set_page_config(page_title="Análise RFM de Clientes", layout="wide")
st.title("📊 Dashboard RFM + Clusterização de Clientes")

# Carregando os dados
uploaded_file = st.file_uploader("📁 Faça upload do arquivo RFM (CSV com clusters)", type=["csv"])
if uploaded_file:
    rfm = pd.read_csv(uploaded_file)

    st.subheader("📋 Prévia dos dados")
    st.dataframe(rfm.head())

    # Filtros
    cluster_opcao = st.selectbox("🔍 Filtrar por Cluster:", options=["Todos"] + sorted(rfm['Cluster'].unique().tolist()))
    if cluster_opcao != "Todos":
        rfm = rfm[rfm['Cluster'] == cluster_opcao]

    st.markdown("---")
    st.subheader("📈 Gráficos por Cluster")
    col1, col2 = st.columns(2)
    with col1:
        fig1, ax1 = plt.subplots()
        sns.boxplot(x='Cluster', y='Recency', data=rfm, ax=ax1)
        st.pyplot(fig1)
    with col2:
        fig2, ax2 = plt.subplots()
        sns.boxplot(x='Cluster', y='Monetary', data=rfm, ax=ax2)
        st.pyplot(fig2)

    col3, col4 = st.columns(2)
    with col3:
        fig3, ax3 = plt.subplots()
        sns.histplot(rfm['Frequency'], kde=True, ax=ax3)
        st.pyplot(fig3)
    with col4:
        fig4, ax4 = plt.subplots()
        sns.scatterplot(x='Frequency', y='Monetary', hue='Cluster', data=rfm, palette='tab10', ax=ax4)
        st.pyplot(fig4)
