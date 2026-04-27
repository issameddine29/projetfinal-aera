// devis-gratuit-fr.js - Traduction française pour "Devis Gratuit"
// (Le français est la langue par défaut de la page devis.html,
//  ce fichier sert à réinitialiser les textes si on revient au FR après EN/NL)

function translateToFrenchQuote() {

    // 1. HERO SECTION
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.textContent = 'Obtenez Votre Devis Personnalisé';
    }

    const heroBadge = document.querySelector('.hero-badge span');
    if (heroBadge) {
        heroBadge.textContent = 'DEVIS GRATUIT SANS ENGAGEMENT';
    }

    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        heroSubtitle.textContent = 'Demandez votre estimation gratuite pour tous les services de nettoyage professionnel à Bruxelles. Transparent, rapide et adapté à vos besoins spécifiques.';
    }

    // Hero features
    const heroFeatures = document.querySelectorAll('.hero-feature span');
    if (heroFeatures.length >= 4) {
        heroFeatures[0].textContent = 'Réponse sous 24h maximum';
        heroFeatures[1].textContent = 'Devis gratuit sans engagement';
        heroFeatures[2].textContent = 'Prix transparents, sans surprises';
        heroFeatures[3].textContent = 'Démarrage rapide possible';
    }

    // Hero button
    const heroButton = document.querySelector('.quote-hero .btn-accent');
    if (heroButton) {
        heroButton.innerHTML = '<i class="fas fa-calculator"></i> Commencer l\'estimation';
    }

    // 2. CALCULATOR SECTION
    const calculatorTitle = document.querySelector('#calculator-title');
    if (calculatorTitle) {
        calculatorTitle.textContent = 'Estimation en ligne';
    }

    const calculatorSubtitle = document.querySelector('.quote-calculator .section-subtitle');
    if (calculatorSubtitle) {
        calculatorSubtitle.textContent = 'Répondez à quelques questions pour obtenir une estimation personnalisée';
    }

    // Steps labels
    const steps = document.querySelectorAll('.calculator-step .step-label');
    if (steps.length >= 4) {
        steps[0].textContent = 'Type de service';
        steps[1].textContent = 'Détails & Options';
        steps[2].textContent = 'Fréquence';
        steps[3].textContent = 'Vos coordonnées';
    }

    // Step 1: Service Type
    const step1Title = document.querySelector('#step-1 h3');
    if (step1Title) {
        step1Title.textContent = 'Quel type de nettoyage recherchez-vous ?';
    }

    const serviceOptions = document.querySelectorAll('.service-option');
    if (serviceOptions.length >= 4) {
        const option1Title = serviceOptions[0].querySelector('h4');
        if (option1Title) option1Title.textContent = 'Bureaux & Locaux commerciaux';
        const option1Desc = serviceOptions[0].querySelector('p');
        if (option1Desc) option1Desc.textContent = 'Nettoyage régulier ou ponctuel pour entreprises et commerces';

        const option2Title = serviceOptions[1].querySelector('h4');
        if (option2Title) option2Title.textContent = 'Résidentiel & Copropriétés';
        const option2Desc = serviceOptions[1].querySelector('p');
        if (option2Desc) option2Desc.textContent = 'Appartements, maisons, parties communes d\'immeubles';

        const option3Title = serviceOptions[2].querySelector('h4');
        if (option3Title) option3Title.textContent = 'Nettoyage spécialisé';
        const option3Desc = serviceOptions[2].querySelector('p');
        if (option3Desc) option3Desc.textContent = 'Tapis, moquettes, vitres, canapés, fin de bail';

        const option4Title = serviceOptions[3].querySelector('h4');
        if (option4Title) option4Title.textContent = 'Industriel & Après travaux';
        const option4Desc = serviceOptions[3].querySelector('p');
        if (option4Desc) option4Desc.textContent = 'Chantiers, locaux industriels, nettoyage en profondeur';
    }

    const nextButton1 = document.querySelector('#step-1 .next-step');
    if (nextButton1) {
        nextButton1.innerHTML = 'Suivant <i class="fas fa-arrow-right"></i>';
    }

    // Step 2: Details & Options
    const step2Title = document.querySelector('#step-2 h3');
    if (step2Title) {
        step2Title.textContent = 'Plus de détails sur vos besoins';
    }

    const surfaceLabel = document.querySelector('label[for="surface-area"]');
    if (surfaceLabel) {
        surfaceLabel.innerHTML = 'Surface à nettoyer (m²) <span class="required">*</span>';
    }

    const sliderLabels = document.querySelectorAll('.slider-header span');
    if (sliderLabels.length >= 3) {
        sliderLabels[0].textContent = 'Petite surface';
        sliderLabels[2].textContent = 'Grande surface';
    }

    const servicesLabel = document.querySelectorAll('.form-label')[1];
    if (servicesLabel) {
        servicesLabel.textContent = 'Services spécifiques souhaités';
    }

    const checkboxes = document.querySelectorAll('.checkbox-option');
    if (checkboxes.length >= 6) {
        const cb1Label = checkboxes[0].querySelector('label');
        if (cb1Label) cb1Label.textContent = 'Nettoyage tapis/moquettes';
        const cb2Label = checkboxes[1].querySelector('label');
        if (cb2Label) cb2Label.textContent = 'Nettoyage des vitres';
        const cb3Label = checkboxes[2].querySelector('label');
        if (cb3Label) cb3Label.textContent = 'Sanitaires & cuisines';
        const cb4Label = checkboxes[3].querySelector('label');
        if (cb4Label) cb4Label.textContent = 'Traitement des sols';
        const cb5Label = checkboxes[4].querySelector('label');
        if (cb5Label) cb5Label.textContent = 'Désinfection spéciale';
        const cb6Label = checkboxes[5].querySelector('label');
        if (cb6Label) cb6Label.textContent = 'Fourniture de produits incluse';
    }

    const notesLabel = document.querySelectorAll('.form-label')[2];
    if (notesLabel) {
        notesLabel.textContent = 'Notes ou exigences particulières';
    }

    const textarea = document.querySelector('#special-notes');
    if (textarea) {
        textarea.placeholder = 'Précisez vos exigences spécifiques, horaires particuliers, ou autres informations importantes...';
    }

    const prevButton2 = document.querySelector('#step-2 .prev-step');
    if (prevButton2) {
        prevButton2.innerHTML = '<i class="fas fa-arrow-left"></i> Précédent';
    }

    const nextButton2 = document.querySelector('#step-2 .next-step');
    if (nextButton2) {
        nextButton2.innerHTML = 'Suivant <i class="fas fa-arrow-right"></i>';
    }

    // Step 3: Frequency
    const step3Title = document.querySelector('#step-3 h3');
    if (step3Title) {
        step3Title.textContent = 'Fréquence du service';
    }

    const frequencyOptions = document.querySelectorAll('#step-3 .service-option');
    if (frequencyOptions.length >= 4) {
        const freq1Title = frequencyOptions[0].querySelector('h4');
        if (freq1Title) freq1Title.textContent = 'Ponctuel / Unique';
        const freq1Desc = frequencyOptions[0].querySelector('p');
        if (freq1Desc) freq1Desc.textContent = 'Nettoyage unique ou occasionnel';
        const freq1Small = frequencyOptions[0].querySelector('small');
        if (freq1Small) freq1Small.textContent = 'Idéal pour fin de bail, après travaux ou occasion spéciale';

        const freq2Title = frequencyOptions[1].querySelector('h4');
        if (freq2Title) freq2Title.textContent = 'Hebdomadaire';
        const freq2Desc = frequencyOptions[1].querySelector('p');
        if (freq2Desc) freq2Desc.textContent = 'Nettoyage régulier chaque semaine';
        const freq2Small = frequencyOptions[1].querySelector('small');
        if (freq2Small) freq2Small.textContent = 'Pour bureaux, commerces ou résidences régulières';

        const freq3Title = frequencyOptions[2].querySelector('h4');
        if (freq3Title) freq3Title.textContent = 'Mensuel';
        const freq3Desc = frequencyOptions[2].querySelector('p');
        if (freq3Desc) freq3Desc.textContent = 'Entretien mensuel ou bimensuel';
        const freq3Small = frequencyOptions[2].querySelector('small');
        if (freq3Small) freq3Small.textContent = 'Pour l\'entretien courant des espaces';

        const freq4Title = frequencyOptions[3].querySelector('h4');
        if (freq4Title) freq4Title.textContent = 'Quotidien';
        const freq4Desc = frequencyOptions[3].querySelector('p');
        if (freq4Desc) freq4Desc.textContent = 'Service complet au quotidien';
        const freq4Small = frequencyOptions[3].querySelector('small');
        if (freq4Small) freq4Small.textContent = 'Pour les entreprises avec des besoins intensifs';
    }

    const prevButton3 = document.querySelector('#step-3 .prev-step');
    if (prevButton3) {
        prevButton3.innerHTML = '<i class="fas fa-arrow-left"></i> Précédent';
    }

    const nextButton3 = document.querySelector('#step-3 .next-step');
    if (nextButton3) {
        nextButton3.innerHTML = 'Suivant <i class="fas fa-arrow-right"></i>';
    }

    // Step 4: Contact Information
    const step4Title = document.querySelector('#step-4 h3');
    if (step4Title) {
        step4Title.textContent = 'Vos coordonnées';
    }

    const estimationTitle = document.querySelector('.estimation-title');
    if (estimationTitle) {
        estimationTitle.textContent = 'Estimation indicative';
    }

    const estimationNote = document.querySelector('.estimation-note');
    if (estimationNote) {
        estimationNote.textContent = '* Ce prix est une estimation basée sur vos réponses. Un devis précis vous sera envoyé après analyse de votre demande.';
    }

    const nameLabel = document.querySelector('label[for="quote-name"]');
    if (nameLabel) {
        nameLabel.innerHTML = 'Nom complet <span class="required">*</span>';
    }
    if (document.getElementById('quote-name')) document.getElementById('quote-name').placeholder = 'Votre prénom et nom';

    const companyLabel = document.querySelector('label[for="quote-company"]');
    if (companyLabel) {
        companyLabel.textContent = 'Société (si applicable)';
    }
    if (document.getElementById('quote-company')) document.getElementById('quote-company').placeholder = 'Nom de votre entreprise';

    const emailLabel = document.querySelector('label[for="quote-email"]');
    if (emailLabel) {
        emailLabel.innerHTML = 'Email <span class="required">*</span>';
    }
    if (document.getElementById('quote-email')) document.getElementById('quote-email').placeholder = 'votre@email.com';

    const phoneLabel = document.querySelector('label[for="quote-phone"]');
    if (phoneLabel) {
        phoneLabel.innerHTML = 'Téléphone <span class="required">*</span>';
    }
    if (document.getElementById('quote-phone')) document.getElementById('quote-phone').placeholder = '+32 XXX XX XX XX';

    const addressLabel = document.querySelector('label[for="quote-address"]');
    if (addressLabel) {
        addressLabel.innerHTML = 'Adresse du site <span class="required">*</span>';
    }
    if (document.getElementById('quote-address')) document.getElementById('quote-address').placeholder = 'Adresse complète à Bruxelles';

    const messageLabel = document.querySelector('label[for="quote-message"]');
    if (messageLabel) {
        messageLabel.textContent = 'Message complémentaire';
    }
    if (document.getElementById('quote-message')) document.getElementById('quote-message').placeholder = 'Précisez toute information supplémentaire utile pour votre devis...';

    const privacyCheckbox = document.querySelector('#quote-privacy + label');
    if (privacyCheckbox) {
        privacyCheckbox.innerHTML = 'J\'accepte la <a href="../privacy.html" target="_blank">politique de confidentialité</a> et j\'autorise le traitement de mes données personnelles <span class="required">*</span>';
    }

    const newsletterCheckbox = document.querySelector('#quote-newsletter + label');
    if (newsletterCheckbox) {
        newsletterCheckbox.textContent = 'Je souhaite recevoir les offres et actualités de Morais Cleaning';
    }

    const prevButton4 = document.querySelector('#step-4 .prev-step');
    if (prevButton4) {
        prevButton4.innerHTML = '<i class="fas fa-arrow-left"></i> Précédent';
    }

    const submitButton = document.querySelector('#submitQuoteBtn');
    if (submitButton) {
        submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Envoyer ma demande';
    }

    // 3. CONTACT INFO SECTION
    const contactTitle = document.querySelector('#contact-title');
    if (contactTitle) {
        contactTitle.textContent = 'Contactez-nous directement';
    }

    const contactSubtitle = document.querySelector('.contact-info-section .section-subtitle');
    if (contactSubtitle) {
        contactSubtitle.textContent = 'Plusieurs moyens de nous joindre pour vos demandes de devis';
    }

    const contactCards = document.querySelectorAll('.contact-card');
    if (contactCards.length >= 3) {
        const card1Title = contactCards[0].querySelector('h3');
        if (card1Title) card1Title.textContent = 'Téléphone';
        const card1Desc = contactCards[0].querySelector('p');
        if (card1Desc) card1Desc.textContent = 'Appelez-nous pour un devis rapide';
        const card1Schedule = contactCards[0].querySelectorAll('p')[1];
        if (card1Schedule) {
            card1Schedule.innerHTML = '<i class="fas fa-clock"></i> Lun-Ven : 8h-18h<br><i class="fas fa-clock"></i> Sam : 9h-13h';
        }

        const card2Title = contactCards[1].querySelector('h3');
        if (card2Title) card2Title.textContent = 'Email';
        const card2Desc = contactCards[1].querySelector('p');
        if (card2Desc) card2Desc.textContent = 'Envoyez-nous vos coordonnées par email';
        const card2Info = contactCards[1].querySelectorAll('p')[1];
        if (card2Info) card2Info.textContent = 'Réponse garantie sous 24h';

        const card3Title = contactCards[2].querySelector('h3');
        if (card3Title) card3Title.textContent = 'Zone d\'intervention';
        const card3Desc = contactCards[2].querySelector('p');
        if (card3Desc) card3Desc.textContent = 'Nous couvrons toute la région bruxelloise';
        const card3List = contactCards[2].querySelectorAll('p')[1];
        if (card3List) {
            card3List.innerHTML = 'Bruxelles-Ville et communes<br>Woluwe-Saint-Lambert<br>Ixelles, Etterbeek<br>Anderlecht, Molenbeek<br>Et toutes les communes avoisinantes';
        }
    }

    // 4. FAQ SECTION
    const faqTitle = document.querySelector('#faq-title');
    if (faqTitle) {
        faqTitle.textContent = 'Questions sur nos Devis';
    }

    const faqSubtitle = document.querySelector('.faq-section .section-subtitle');
    if (faqSubtitle) {
        faqSubtitle.textContent = 'Tout ce que vous devez savoir sur nos tarifs et notre processus';
    }

    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length >= 5) {
        const faq1Btn = faqItems[0].querySelector('.faq-question');
        if (faq1Btn) faq1Btn.textContent = 'Comment vos prix sont-ils calculés ?';
        const faq1Answer = faqItems[0].querySelector('.faq-answer p');
        if (faq1Answer) {
            faq1Answer.textContent = 'Nos prix sont calculés en fonction de plusieurs critères : surface à nettoyer, type de service, fréquence, spécificités techniques et matériel nécessaire. Nous proposons toujours le meilleur rapport qualité-prix avec une totale transparence sur les coûts.';
        }

        const faq2Btn = faqItems[1].querySelector('.faq-question');
        if (faq2Btn) faq2Btn.textContent = 'Le devis est-il vraiment gratuit et sans engagement ?';
        const faq2Answer = faqItems[1].querySelector('.faq-answer p');
        if (faq2Answer) {
            faq2Answer.textContent = 'Absolument. Notre estimation en ligne et le devis détaillé que nous vous envoyons ensuite sont entièrement gratuits. Vous n\'avez aucune obligation de commander après réception du devis.';
        }

        const faq3Btn = faqItems[2].querySelector('.faq-question');
        if (faq3Btn) faq3Btn.textContent = 'Combien de temps pour recevoir mon devis ?';
        const faq3Answer = faqItems[2].querySelector('.faq-answer p');
        if (faq3Answer) {
            faq3Answer.textContent = 'L\'estimation en ligne est immédiate. Pour un devis détaillé personnalisé, nous nous engageons à répondre sous 24h ouvrées maximum, souvent beaucoup plus rapidement.';
        }

        const faq4Btn = faqItems[3].querySelector('.faq-question');
        if (faq4Btn) faq4Btn.textContent = 'Proposez-vous des forfaits mensuels ?';
        const faq4Answer = faqItems[3].querySelector('.faq-answer p');
        if (faq4Answer) {
            faq4Answer.textContent = 'Oui, nous proposons des forfaits mensuels, trimestriels et annuels avec des tarifs préférentiels pour les contrats longue durée. Ces forfaits incluent souvent des services supplémentaires gratuits.';
        }

        const faq5Btn = faqItems[4].querySelector('.faq-question');
        if (faq5Btn) faq5Btn.textContent = 'Quels modes de paiement acceptez-vous ?';
        const faq5Answer = faqItems[4].querySelector('.faq-answer p');
        if (faq5Answer) {
            faq5Answer.textContent = 'Nous acceptons les virements bancaires, cartes de crédit/débit, PayPal et pour les entreprises, nous pouvons émettre des factures avec délai de paiement. Tous les prix sont TVAC.';
        }
        faqItems[4].querySelector('.faq-answer').removeAttribute('hidden');
    }

    // 5. FINAL CTA SECTION
    const ctaTitle = document.querySelector('#cta-title');
    if (ctaTitle) {
        ctaTitle.textContent = 'Besoin d\'un devis urgent ?';
    }

    const ctaText = document.querySelector('.final-cta p');
    if (ctaText) {
        ctaText.textContent = 'Contactez-nous directement par téléphone pour une estimation immédiate et un démarrage rapide de vos travaux de nettoyage.';
    }

    const ctaButtons = document.querySelectorAll('.final-cta .btn');
    if (ctaButtons.length >= 2) {
        ctaButtons[0].innerHTML = '<i class="fas fa-phone"></i> Appeler maintenant : 0478/95.12.69';
        ctaButtons[1].innerHTML = '<i class="fas fa-calculator"></i> Recommencer l\'estimation';
    }

    const featureList = document.querySelectorAll('.final-cta span');
    if (featureList.length >= 4) {
        featureList[0].textContent = 'Devis gratuit';
        featureList[1].textContent = 'Réponse sous 24h';
        featureList[2].textContent = 'Sans engagement';
        featureList[3].textContent = 'Prix transparents';
    }

    // Update meta tags
    updateMetaTagsFrench();
}

function updateMetaTagsFrench() {
    document.title = 'Devis Gratuit - Morais Cleaning - Nettoyage Bruxelles';

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.content = 'Demandez votre devis gratuit pour tous les services de nettoyage à Bruxelles : bureaux, locaux commerciaux, résidentiel, tapis, vitres, fin de bail. Réponse rapide sous 24h.';
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
        ogTitle.content = 'Devis Gratuit Nettoyage - Morais Cleaning Bruxelles';
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
        ogDescription.content = 'Obtenez un devis personnalisé pour vos besoins de nettoyage professionnel à Bruxelles. Service rapide, transparent et sans engagement.';
    }
}

function loadFrenchTranslationQuote() {
    translateToFrenchQuote();
}

// Exposition pour app.js
window.applyQuoteTranslations = translateToFrenchQuote;
