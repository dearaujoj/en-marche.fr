import './style/app.scss';

import Container from './services/Container';
import registerServices from './services';

// Listeners
import amountChooser from './listeners/amount-chooser';
import cookiesConsent from './listeners/cookies-consent';
import donationBanner from './listeners/donation-banner';
import progressiveBackground from './listeners/progressive-background';
import externalLinks from './listeners/external-links';
import noJsRecaptcha from './listeners/no-js-recaptcha';

class App {
    constructor() {
        this._di = null;
        this._listeners = [
            cookiesConsent,
            donationBanner,
            amountChooser,
            progressiveBackground,
            externalLinks,
            noJsRecaptcha,
        ];
    }

    addListener(listener) {
        this._listeners.push(listener);
    }

    run(parameters) {
        this._di = new Container(parameters);

        // Register the services
        registerServices(this._di);

        // Execute the page load listeners
        this._listeners.forEach((listener) => {
            listener(this._di);
        });
    }

    get(key) {
        return this._di.get(key);
    }

    share(type, url, title) {
        this._di.get('sharer').share(type, url, title);
    }

    createAddressSelector(country, postalCode, city, cityName) {
        const formFactory = this._di.get('address.form_factory');
        const form = formFactory.createAddressForm(country, postalCode, city, cityName);

        form.prepare();
        form.refresh();
        form.attachEvents();
    }

    runDonation() {
        System.import('pages/donation').catch((error) => { throw error; }).then((module) => {
            module.default();
        });
    }

    runOrganisation() {
        System.import('pages/organisation').catch((error) => { throw error; }).then((module) => {
            module.default(this.get('api'));
        });
    }

    runReferentUsers(users) {
        System.import('pages/referent_users').catch((error) => { throw error; }).then((module) => {
            module.default(this.get('slugifier'), users);
        });
    }

    runJeMarche() {
        System.import('pages/jemarche').catch((error) => { throw error; }).then((module) => {
            module.default();
        });
    }

    runSearchCommittees(defaultLocation) {
        System.import('pages/search_committees').catch((error) => { throw error; }).then((module) => {
            module.default(defaultLocation);
        });
    }

    runSearchEvents(defaultLocation) {
        System.import('pages/search_events').catch((error) => { throw error; }).then((module) => {
            module.default(defaultLocation);
        });
    }
}

window.App = new App();
