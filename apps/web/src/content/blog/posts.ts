import type { BlogCopy } from "./types";

const published = "2026-11-11";

export const blogPosts: BlogCopy = {
  is: [
    {
      slug: "hvad-er-rekstrarkerfi",
      title: "Hvað er rekstrarkerfi?",
      description:
        "Rekstrarkerfi er mælaborð, sjálfvirkni og vikulegur taktur sem heldur íslensku fyrirtæki gangandi án þess að allt fari í gegnum eigandann.",
      publishedAt: published,
      updatedAt: published,
      tags: ["rekstrarkerfi", "rekstrarráðgjöf", "Ísland"],
      sections: [
        {
          type: "p",
          text: "Mörg íslensk fyrirtæki ganga vel á meðan eigandinn er á staðnum. Tölurnar sitja í hausnum, ákvarðanir bíða mánudags og sami hluturinn er unninn aftur í hverri viku. Það er ekki rekstur. Það er vinna sem hættir þegar þú ferð í frí.",
        },
        {
          type: "h2",
          text: "Þrír hlutar, ekki eitt verkefni",
        },
        {
          type: "p",
          text: "Rekstrarkerfi er ekki nýtt forrit sem á að leysa allt. Það er þrennt sem vinnur saman: mælaborð sem sýna tölurnar, sjálfvirkni sem tekur endurtekna vinnu, og vikulegur taktur sem heldur fólki ábyrgu.",
        },
        {
          type: "ul",
          items: [
            "Mælaborð: þú sérð hvaða viðskiptavinir og verkefni bera sig, án þess að biðja um skýrslu.",
            "Sjálfvirkni: sama verkið er ekki slegið inn aftur af því að það hefur alltaf verið gert svona.",
            "Taktur: einn fastur tími í viku þar sem tölur, flöskuhálsar og næstu aðgerðir eru á borðinu.",
          ],
        },
        {
          type: "h2",
          text: "Hvenær er kominn tími",
        },
        {
          type: "p",
          text: "Merkið er einfalt. Þú getur ekki farið í tveggja vikna frí án þess að eitthvað stöðvist. Stórar ákvarðanir byggjast á tilfinningu. Enginn getur sagt til um hvort viðskiptavinur sé arðbær. Þá er næsta skref ekki fleiri fundir. Það er skoðun á fólki, ferlum og tölum, og þrjár til fimm aðgerðir sem bæta árangur.",
        },
      ],
      links: [
        { href: "/sjalfsmat", label: "Taktu tveggja mínútna sjálfsmatið" },
        { href: "/daemi", label: "Sjáðu hvernig skoðun lítur út í alvöru" },
      ],
    },
    {
      slug: "vikulegur-taktur",
      title: "Vikulegur taktur heldur rekstrinum gangandi",
      description:
        "Einn fastur fundur í viku, með tölum og ábyrgð, skiptir meira máli en nýtt verkfæri. Svona lítur takturinn út hjá íslenskum fyrirtækjum.",
      publishedAt: published,
      updatedAt: published,
      tags: ["vikulegur taktur", "stjórnun", "mælaborð"],
      sections: [
        {
          type: "p",
          text: "Flest fyrirtæki sem við hittum eiga nóg af fundum. Það sem vantar er einn fundur sem er alltaf eins. Sami tími, sömu tölur, sömu spurningar. Án þess rennur vikan áfram og eigandinn verður aftur flöskuhálsinn.",
        },
        {
          type: "h2",
          text: "Hvað á að vera á borðinu",
        },
        {
          type: "ul",
          items: [
            "Tölurnar sem skipta máli þessa viku, ekki tuttugu mælikvarðar.",
            "Það sem stöðvaðist, og hver á næsta skref.",
            "Ein ákvörðun sem má ekki bíða næsta mánaðar.",
          ],
        },
        {
          type: "p",
          text: "Fundurinn á að vera stuttur. Ef hann tekur klukkustund er hann orðinn stöðufundur. Markmiðið er að reksturinn hreyfist án þess að þú þurfir að muna allt sjálfur.",
        },
        {
          type: "h2",
          text: "Af hverju verkfæri duga ekki ein",
        },
        {
          type: "p",
          text: "Nýtt mælaborð breytir engu ef enginn horfir á það sama daginn í hverri viku. Sjálfvirkni breytir engu ef enginn ber ábyrgð þegar hún bilar. Takturinn er hlutinn sem heldur hinum tveimur á lífi.",
        },
      ],
      links: [
        { href: "/", label: "Sjáðu þrjú skrefin í þjónustunni" },
        { href: "/namskeid", label: "Námskeið fyrir eigendur og stjórnendur" },
      ],
    },
    {
      slug: "gervigreind-og-gogn-vidskiptavina",
      title: "Gervigreind án þess að leka gögnum viðskiptavina",
      description:
        "Helmingur íslenskra fyrirtækja notar gervigreind. Fá hafa stefnu. Svona er hægt að nota hana í daglegum rekstri og halda gögnum viðskiptavina innan marka.",
      publishedAt: published,
      updatedAt: published,
      tags: ["gervigreind", "persónuvernd", "rekstur"],
      sections: [
        {
          type: "p",
          text: "Fólk í fyrirtækinu er þegar farið að nota gervigreind, oft í eigin vafranum. Spurningin er ekki hvort hún sé til staðar. Spurningin er hvaða gögn mega fara þangað, og hver ber ábyrgð þegar eitthvað fer úrskeiðis.",
        },
        {
          type: "h2",
          text: "Þrennt sem stefnan þarf að segja",
        },
        {
          type: "ul",
          items: [
            "Hvað má setja inn: drög, innri textar, opinber gögn.",
            "Hvað má ekki: kennitölur, samningar, gögn viðskiptavina, lykilorð.",
            "Hver samþykkir nýtt verkfæri, og hvar niðurstaðan er geymd.",
          ],
        },
        {
          type: "p",
          text: "Þegar gervigreindarverkefni mistekst er það sjaldan líkaninu að kenna. Ferlar, ábyrgð og þjálfun voru aldrei kláruð. Tæknin er minni hlutinn. Fólk og ferlar eru stærri hlutinn.",
        },
        {
          type: "h2",
          text: "Byrjaðu á rekstrinum, ekki á tækinu",
        },
        {
          type: "p",
          text: "Veldu eitt endurtekið verk, settu mörkin skriflega, og mældu hvort tími sparast. Ef verkið snertir gögn viðskiptavina á það ekki að fara í opið spjall. Þá er betra að bíða, eða smíða lausn sem heldur gögnunum inni.",
        },
      ],
      links: [
        { href: "/gervigreind", label: "Lesa stefnu Virkum um gervigreind" },
        { href: "/personuvernd", label: "Persónuvernd, kökur og greining" },
      ],
    },
  ],
  en: [
    {
      slug: "hvad-er-rekstrarkerfi",
      title: "What is an operating system for a company?",
      description:
        "An operating system is dashboards, automation and a weekly rhythm that keep an Icelandic company moving without everything passing through the owner.",
      publishedAt: published,
      updatedAt: published,
      tags: ["operating system", "operations", "Iceland"],
      sections: [
        {
          type: "p",
          text: "Many Icelandic companies run well while the owner is in the room. The numbers live in one person's head, decisions wait until Monday, and the same task is done again every week. That is not an operation. It is a job that stops when you go on leave.",
        },
        {
          type: "h2",
          text: "Three parts, not one project",
        },
        {
          type: "p",
          text: "An operating system is not a new piece of software that is supposed to fix everything. It is three things working together: dashboards that show the numbers, automation that takes repeated work, and a weekly rhythm that keeps people accountable.",
        },
        {
          type: "ul",
          items: [
            "Dashboards: you can see which clients and jobs pay, without asking for a report.",
            "Automation: the same task is not typed in again because it has always been done that way.",
            "Rhythm: one fixed time each week where numbers, bottlenecks and the next actions are on the table.",
          ],
        },
        {
          type: "h2",
          text: "When it is time",
        },
        {
          type: "p",
          text: "The sign is simple. You cannot take two weeks off without something stopping. Large decisions rest on a feeling. Nobody can say whether a client is profitable. The next step is not more meetings. It is a look at people, processes and numbers, and three to five actions that improve the result.",
        },
      ],
      links: [
        { href: "/sjalfsmat", label: "Take the two-minute self-assessment" },
        { href: "/daemi", label: "See what a review looks like in practice" },
      ],
    },
    {
      slug: "vikulegur-taktur",
      title: "A weekly rhythm keeps the operation moving",
      description:
        "One fixed meeting a week, with numbers and ownership, matters more than a new tool. This is what that rhythm looks like in an Icelandic company.",
      publishedAt: published,
      updatedAt: published,
      tags: ["weekly rhythm", "management", "dashboards"],
      sections: [
        {
          type: "p",
          text: "Most companies we meet already have plenty of meetings. What is missing is one meeting that is always the same. Same time, same numbers, same questions. Without it, the week slips by and the owner becomes the bottleneck again.",
        },
        {
          type: "h2",
          text: "What belongs on the table",
        },
        {
          type: "ul",
          items: [
            "The numbers that matter this week, not twenty metrics.",
            "What stopped, and who owns the next step.",
            "One decision that cannot wait until next month.",
          ],
        },
        {
          type: "p",
          text: "The meeting should be short. If it takes an hour, it has become a status meeting. The point is that the operation moves without you having to remember everything yourself.",
        },
        {
          type: "h2",
          text: "Why a tool on its own is not enough",
        },
        {
          type: "p",
          text: "A new dashboard changes nothing if nobody looks at it on the same day every week. Automation changes nothing if nobody owns it when it breaks. The rhythm is the part that keeps the other two alive.",
        },
      ],
      links: [
        { href: "/", label: "See the three steps of the work" },
        { href: "/namskeid", label: "Courses for owners and managers" },
      ],
    },
    {
      slug: "gervigreind-og-gogn-vidskiptavina",
      title: "Use AI without leaking client data",
      description:
        "Half of Icelandic companies use AI. Few have a policy. Here is how to use it in daily operations and keep client data inside clear limits.",
      publishedAt: published,
      updatedAt: published,
      tags: ["AI", "privacy", "operations"],
      sections: [
        {
          type: "p",
          text: "People in the company are already using AI, often in their own browser. The question is not whether it is present. The question is which data may go there, and who is responsible when something goes wrong.",
        },
        {
          type: "h2",
          text: "Three things a policy has to say",
        },
        {
          type: "ul",
          items: [
            "What may be entered: drafts, internal text, public information.",
            "What may not: national IDs, contracts, client data, passwords.",
            "Who approves a new tool, and where the result is stored.",
          ],
        },
        {
          type: "p",
          text: "When an AI project fails, the model is rarely the reason. Processes, ownership and training were never finished. The technology is the smaller part. People and processes are the larger part.",
        },
        {
          type: "h2",
          text: "Start with the operation, not the tool",
        },
        {
          type: "p",
          text: "Pick one repeated task, write the limits down, and measure whether time is saved. If the task touches client data, it should not go into an open chat. Then it is better to wait, or to build something that keeps the data inside.",
        },
      ],
      links: [
        { href: "/gervigreind", label: "Read Virkum's AI policy" },
        { href: "/personuvernd", label: "Privacy, cookies and analytics" },
      ],
    },
  ],
};
