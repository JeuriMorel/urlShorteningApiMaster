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

const shortenUrl = async (url) => {
  try {
    let res = await fetch(`https://api.shrtco.de/v2/shorten?url=${url}`);
    let data = await res.json();
    if (!data.ok) {
      loader.style.display = "none";
      form.classList.add("error");
      return;
    }
    createUrlDiv(data.result);
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
  children.forEach(child => child.children[1].classList.remove('copied'))
  console.log(children)
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

const createFragment = (long, short) => {
  let fragment = document.createElement("div");
  fragment.className = "short";
  fragment.innerHTML = `${long}
  <span>
  ${short}
  </span>
  <button onclick="copyLink(event)">Copy</button>`;

  return fragment;
};
