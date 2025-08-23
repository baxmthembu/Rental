const Features = () => {
    return(
        <section class="py-16 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-12">
                    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Rentekasi?</h2>
                    <p class="text-xl text-gray-600">Transforming township rentals with trust, technology, and transparency</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div class="text-center p-6 bg-gray-50 rounded-lg">
                        <div class="w-16 h-16 bg-sa-green rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12I2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold mb-2">Verified Listings</h3>
                        <p class="text-gray-600">Every property is verified and inspected. No more scams or fake listings.</p>
                    </div>
                    <div class="text-center p-6 bg-gray-50 rounded-lg">
                        <div class="w-16 h-16 bg-sa-gold rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold mb-2">Instant Screening</h3>
                        <p class="text-gray-600">Quick tenant verification and credit checks for faster, safer rentals.</p>
                    </div>
                    <div class="text-center p-6 bg-gray-50 rounded-lg">
                        <div class="w-16 h-16 bg-sa-blue rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold mb-2">Financing Partners</h3>
                        <p class="text-gray-600">Connect with major SA banks for rental deposits and property development loans.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Features;