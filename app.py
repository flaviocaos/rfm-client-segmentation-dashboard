import streamlit as st
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

# Título
st.title("Dashboard de Segmentação de Clientes com RFM")

# Carregar base
@st.cache_data
def load_data():
    return pd.read_csv("base_exemplo_compras.csv")

df = load_data()

# Exibir dados
if st.checkbox("Mostrar tabela de dados"):
    st.write(df.head(20))

# Gráfico de dispersão RFM
st.subheader("Dispersão entre Recência, Frequência e Valor Monetário")
fig, ax = plt.subplots()
sns.scatterplot(data=df, x="recencia", y="frequencia", hue="cluster", size="valor_monetario", ax=ax)
st.pyplot(fig)

# Informações sobre clusters
st.subheader("Média dos clusters por grupo")
st.write(df.groupby("cluster")[["recencia", "frequencia", "valor_monetario"]].mean())
