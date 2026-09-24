document.addEventListener(
    "DOMContentLoaded",
    function () {

        const menuButton =
            document.querySelector(
                ".mobile-menu-toggle"
            );

        const mobileMenu =
            document.querySelector(
                ".mobile-nav-menu"
            );


        if (
            !menuButton ||
            !mobileMenu
        ) {
            return;
        }


        function closeMenu() {

            mobileMenu.classList.remove(
                "open"
            );

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );

            menuButton.setAttribute(
                "aria-label",
                "Open navigation menu"
            );


            menuButton.innerHTML = `
                <span></span>
                <span></span>
                <span></span>
            `;
        }


        function openMenu() {

            mobileMenu.classList.add(
                "open"
            );

            menuButton.setAttribute(
                "aria-expanded",
                "true"
            );

            menuButton.setAttribute(
                "aria-label",
                "Close navigation menu"
            );


            menuButton.innerHTML = `
                <span>✕</span>
            `;
        }


        menuButton.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();


                if (
                    mobileMenu.classList.contains(
                        "open"
                    )
                ) {

                    closeMenu();

                } else {

                    openMenu();

                }

            }
        );


        const links =
            mobileMenu.querySelectorAll(
                "a"
            );


        links.forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        closeMenu();

                    }
                );

            }
        );


        document.addEventListener(
            "click",
            function (event) {

                if (
                    mobileMenu.classList.contains(
                        "open"
                    ) &&
                    !mobileMenu.contains(
                        event.target
                    ) &&
                    !menuButton.contains(
                        event.target
                    )
                ) {

                    closeMenu();

                }

            }
        );


        window.addEventListener(
            "resize",
            function () {

                if (
                    window.innerWidth > 768
                ) {

                    closeMenu();

                }

            }
        );

    }
);