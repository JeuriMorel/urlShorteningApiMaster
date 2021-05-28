const hamburger = document.querySelector(".header_nav-hamburger");
const mobileNav = document.querySelector(".header_nav-mobile");
const form = document.querySelector(".hero_shorten_form");
const input = document.querySelector(".hero_shorten_form-input");
const btn = document.querySelector(".hero_shorten_form-btn");
const loader = document.querySelector(".loader");
const section = document.querySelector(".section");

hamburger.addEventListener("click", () => {
  mobileNav.classList.toggle("closed");
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  shortenUrl(input.value);
  loader.style.display = "inline-block";
});

input.addEventListener("input", () => {
  form.classList.remove("error");
});

document.addEventListener(
  "invalid",
  (function () {
    return function (e) {
      e.preventDefault();
      form.classList.add("error");
    };
  })(),
  true
);

const checkLinks = () => {
  let links = document.querySelectorAll('.short')
  if (links.length > 4) {
    links[4].remove();
  }
}

const shortenUrl = async (url) => {
  try {
    let res = await fetch(`https://api.shrtco.de/v2/shorten?url=${url}`);
    let data = await res.json();
    if (!data.ok) {
      loader.style.display = "none";
      form.classList.add("error");
      return;
    }
    checkLinks();
    createUrlDiv(data.result);
    addToStorage();
    loader.style.display = "none";
    form.reset();
  } catch (error) {
    loader.style.display = "none";
    form.classList.add("error");
  }
};

const createUrlDiv = ({ original_link: long, full_short_link: short }) => {
  let div = createFragment(long, short);
  section.prepend(div);
};

const showCopied =(btn)=>{
  const children = [...section.children]
  children.forEach(child => child.children[2]?.classList.remove('copied'))
  btn.classList.add('copied')
}

const copyLink = async (e) => {
  let shortLink = e.target.previousElementSibling.textContent
  let clipboard = navigator.clipboard
  try {
    await clipboard.writeText(shortLink);
    showCopied(e.target);
  } catch (error) {
    console.log('Failed to copy: ', error)
  }
}

const addToStorage = () => {
  const shortLinkDivs = Array.from(document.querySelectorAll(".short"));

  let storageDivs = shortLinkDivs.map(div => {
    return [div.children[0].textContent, div.children[1].textContent] 
  })
  localStorage.setItem('linkDivs', JSON.stringify(storageDivs))
}

const createFragment = (long, short) => {
  let fragment = document.createElement("div");
  fragment.className = "short";
  fragment.innerHTML = `
  <p>
  ${long}
  </p>
  <span>
  ${short}
  </span>
  <button onclick="copyLink(event)">Copy</button>`;

  return fragment;
};

window.addEventListener('load', () => {
  let linkDivs = JSON.parse(localStorage.getItem("linkDivs"));
  if (!linkDivs) {
    return
  }
  linkDivs.forEach(linkDiv => {
    let div = createFragment(linkDiv[0], linkDiv[1]);
    section.prepend(div);
  })
})
