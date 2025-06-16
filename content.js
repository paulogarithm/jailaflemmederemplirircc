// change this for whatever you want if its not study permit in france
const valuesToSelect = [
  "Résidence temporaire (visite, étude, travail)",
  "Permis d’études (de l’étranger)",
  "France"
];

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const getNthSelect = async (container, index, retries = 20) => {
    let select = null;
    while (retries-- > 0) {
        const selects = container.querySelectorAll('select');
        if (selects.length > index) {
            select = selects[index];
            break;
        }
        await sleep(100);
    }
    return select;
};

const getElementTimeout = async (id, retries) => {
    let select = null;
    let n = retries;
    
    while (!select && n-- > 0) {
        select = document.getElementById(id);
        if (!select)
            await sleep(100);
    }
    if (!select) {
        console.error(`'${id}'not found after ${retries} retries`);
        return null;
    }
    return select;
}

const master = async () => {
    // check main container
    const container = await getElementTimeout('wb-auto-6', 10);
    if (!container) {
        console.error("'wb-auto-6' not found")
        return;
    }

    // make the selections
    // for (const [id, value] of Object.entries(truthTable)) {
    //     let select = await getSelectTimeout(id, 10);
    //     if (select == null) {
    //         return;
    //     }
    //     select.value = value;
    //     select.dispatchEvent(new Event('change', { bubbles: true }));
    // }
    for (let i = 0; i < valuesToSelect.length; i++) {
        const value = valuesToSelect[i];
        const select = await getNthSelect(container, i);
        if (!select) {
            console.error(`select #${i} not found`);
            return;
        }
        const option = Array.from(select.options).find(opt => opt.text.trim() === value);
        if (!option) {
            console.error(`option "${value}" not found in #${i}`);
            return;
        }
        select.value = option.value;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        await sleep(100);
    }
    
    // click on the button
    await sleep(100);
    const button = document.querySelector('button.btn-submit');
    if (!button) {
        console.error("'btn-submit' not found");
        return;
    }
    button.click();

    // scroll
    await sleep(300);
    const heading = document.getElementById('typeOtpt');
    if (heading)
        heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

setTimeout(master, 100);
