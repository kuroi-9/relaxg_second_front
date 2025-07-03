const HomePage = () => {
    return (
        <>
            <head>
                <title>Accueil - Votre Site Stylé</title>
                <meta
                    name="description"
                    content="Bienvenue sur notre site d'accueil stylé, optimisé pour le SEO. Découvrez nos services et produits exceptionnels."
                />
                <meta
                    name="keywords"
                    content="Accueil, Stylé, SEO, Services, Produits"
                />
                <meta name="author" content="Votre Nom ou Entreprise" />
            </head>
            <main
                style={{
                    fontFamily: "Arial, sans-serif",
                    lineHeight: "1.6",
                    color: "#333",
                    backgroundColor: "#f9f9f9",
                    padding: "20px",
                }}
            >
                <header style={{ textAlign: "center", marginBottom: "40px" }}>
                    <h1 style={{ fontSize: "3rem", color: "#4CAF50" }}>
                        Bienvenue sur Notre Site
                    </h1>
                    <p style={{ fontSize: "1.2rem" }}>
                        Découvrez une expérience unique avec nos services et
                        produits de qualité.
                    </p>
                </header>
                <section
                    style={{
                        display: "flex",
                        justifyContent: "space-around",
                        flexWrap: "wrap",
                    }}
                >
                    <div
                        style={{
                            maxWidth: "300px",
                            margin: "10px",
                            padding: "20px",
                            backgroundColor: "#fff",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <h2 style={{ fontSize: "1.5rem", color: "#333" }}>
                            Nos Services
                        </h2>
                        <p>
                            Explorez une gamme de services conçus pour répondre
                            à vos besoins.
                        </p>
                    </div>
                    <div
                        style={{
                            maxWidth: "300px",
                            margin: "10px",
                            padding: "20px",
                            backgroundColor: "#fff",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <h2 style={{ fontSize: "1.5rem", color: "#333" }}>
                            Nos Produits
                        </h2>
                        <p>
                            Découvrez des produits innovants et de haute
                            qualité.
                        </p>
                    </div>
                </section>
                <footer
                    style={{
                        textAlign: "center",
                        marginTop: "40px",
                        padding: "10px",
                        backgroundColor: "#4CAF50",
                        color: "#fff",
                    }}
                >
                    <p>&copy; 2023 Votre Entreprise. Tous droits réservés.</p>
                </footer>
            </main>
        </>
    );
};

export default HomePage;
