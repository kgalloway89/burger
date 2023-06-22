(function () {
  var template = document.createElement('template');
  var burgerSVGTemplate = document.createElement('template');

  burgerSVGTemplate.innerHTML = `
<svg class="desktop-burger" style="vertical-align:middle;" viewBox="0 0 100 100" width="40" height="40">
  <rect width="100" height="2"></rect>
  <rect y="30" width="100" height="2"></rect>
  <rect y="60" width="100" height="2"></rect>
</svg>
    `;
  template.innerHTML = `
    <style>
        :host {
            display: block;
            visibility: hidden;
            position: fixed;
            /* Update */
            background: white;
            top: 0;
            right:0;
            width: 100%;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index:10000;
            font-family: inherit;
            transform: translate(100%,0%);
            transition: all 0.6s cubic-bezier(0.85, 0, 0.15, 1);
        }

        :host(.is-open) {
            visibility:visible;
            transform: translate(0%,0%);
        }

        ::slotted(*) {
            font-family: inherit;
			opacity: 0;
        }


    .burgerOverlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index:10000;
    }

    .burgerToggle {
        position: absolute;
        top: 48px;
        right: 48px;
    }

    .burgerToggle svg {
        width: 32px;
        height: 32px;
        vertical-align:middle;
        cursor: pointer;
    }

    .burgerToggle svg path {
      --close-burger: black;
      fill: var(--close-burger);
    }


    </style>



    <slot></slot>
    <div part="burgerToggle" class="burgerToggle"><svg class="desktop-burger" style="vertical-align:middle;" viewBox="0 0 100 100" width="40" height="40">
  <rect width="100" height="2"></rect>
  <rect y="30" width="100" height="2"></rect>
  <rect y="60" width="100" height="2"></rect>
</svg>
    </div>




    `;

  class BetterBurger extends HTMLElement {
    constructor() {
      super();
      let self = this;
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this.burger = document.querySelector('a[href="/burger"]');
      this.burger.textContent = '';
      this.animationCount = 0;
      this.burger.appendChild(burgerSVGTemplate.content.cloneNode(true));
      this.burgerToggle = this.shadowRoot.querySelector('.burgerToggle');
      this.burger.addEventListener('click', function () {
        console.log('the burger has been clicked');
        self.classList.toggle('is-open');

        if (self.animationCount === 0) {
          setTimeout(function () {
            self.animateLinks();
            self.animationCount++;
          }, 200);
        }
        setTimeout(function () {
          self.preventBodyScrollWhenVisible();
        }, 1000);
      });

      this.burgerToggle.addEventListener('click', function () {
        self.classList.toggle('is-open');
        self.resetBodyPositionWhenNotVisible();
      });
    }

    getBurgerLinks() {
      var burger = document.querySelector('a[href="/burger"]');
      var links = burger.nextElementSibling.querySelectorAll('a');
      return links;
    }

    preventBodyScrollWhenVisible() {
      // When the overlay is shown, we want a fixed body
      document.body.style.position = 'fixed';
      document.body.style.top = `-${window.scrollY}px`;
    }

    resetBodyPositionWhenNotVisible() {
      // When the modal is hidden...
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }

    animateLinks() {
      var links = this.querySelectorAll('a');
      links.forEach((link, index) => {
        link.style.opacity = '0';
        link.animate(
          {
            opacity: ['0', '1'],
            transform: ['translateY(12px)', 'translateY(0px)'],
            transform: ['scale(1.2)', 'scale(1)'],
          },
          {
            duration: parseInt(500, 10),
            delay: (index + 1) * 150,
            fill: 'both',
            easing: 'ease-in-out',
          }
        );
      });
    }

    connectedCallback() {
      this.getBurgerLinks();
      // console.log(overlay)
      this.getBurgerLinks().forEach(link => {
        link.classList.add('header-nav-item');
        link.style.fontSize = '4vmin';
        this.appendChild(link);
      });
    }
  }
  window.customElements.define('better-burger', BetterBurger);
})();
