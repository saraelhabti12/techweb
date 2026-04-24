import MainLayout from '@/Layouts/MainLayout';

export default function Home() {
    return (
        <MainLayout>
            {/* Tes sections ici */}
            <section className="py-12 bg-gray-100">
                <div className="container mx-auto">
                    <h1 className="text-3xl font-bold">Bienvenue sur TechWeb</h1>
                    <p className="mt-4">Votre plateforme technologique.</p>
                </div>
            </section>
            {/* Ajoute d'autres sections selon tes besoins */}
        </MainLayout>
    );
}
