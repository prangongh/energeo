/* === Signin Yeti === */
//This yeti is duct taped together
//I heavily modified it a while ago to work in an old app, and I copied over that dumpster fire here
//Source: https://codepen.io/dsenneff/details/2d338b0adf97472ebc5d473cf1fa910b

function runAnimation() {
    let lemail = document.querySelector('input[name=zipcode]'),
        lpassword = document.querySelector('input[name=signin_password]'),
        mySVG = document.querySelector('.svgContainer'),
        armL = document.querySelector('.armL'),
        armR = document.querySelector('.armR'),
        eyeL = document.querySelector('.eyeL'),
        eyeR = document.querySelector('.eyeR'),
        nose = document.querySelector('.nose'),
        mouth = document.querySelector('.mouth'),
        mouthBG = document.querySelector('.mouthBG'),
        mouthSmallBG = document.querySelector('.mouthSmallBG'),
        mouthMediumBG = document.querySelector('.mouthMediumBG'),
        mouthLargeBG = document.querySelector('.mouthLargeBG'),
        mouthMaskPath = document.querySelector('#mouthMaskPath'),
        mouthOutline = document.querySelector('.mouthOutline'),
        tooth = document.querySelector('.tooth'),
        tongue = document.querySelector('.tongue'),
        chin = document.querySelector('.chin'),
        face = document.querySelector('.face'),
        eyebrow = document.querySelector('.eyebrow'),
        outerEarL = document.querySelector('.earL .outerEar'),
        outerEarR = document.querySelector('.earR .outerEar'),
        earHairL = document.querySelector('.earL .earHair'),
        earHairR = document.querySelector('.earR .earHair'),
        hair = document.querySelector('.hair');
    let caretPos, curEmailIndex, screenCenter, svgCoords, eyeMaxHorizD = 20,
        eyeMaxVertD = 10,
        noseMaxHorizD = 23,
        noseMaxVertD = 10,
        dFromC, eyeDistH, eyeLDistV, eyeRDistV, eyeDistR, mouthStatus = "small";

    function getCoord(e) {
        //@ts-ignore
        var carPos = lemail.selectionEnd,
            div = document.createElement('div'),
            span = document.createElement('span'),
            copyStyle = getComputedStyle(lemail),
            emailCoords = {},
            caretCoords = {},
            centerCoords = {};
        [].forEach.call(copyStyle, function (prop) {
            div.style[prop] = copyStyle[prop];
        });
        div.style.position = 'absolute';
        document.body.appendChild(div);
        //@ts-ignore
        div.textContent = lemail.value.substr(0, carPos);
        //@ts-ignore
        span.textContent = lemail.value.substr(carPos) || '.';
        div.appendChild(span);

        emailCoords = getPosition(lemail); //console.log("emailCoords.x: " + emailCoords.x + ", emailCoords.y: " + emailCoords.y);
        caretCoords = getPosition(span); //console.log("caretCoords.x " + caretCoords.x + ", caretCoords.y: " + caretCoords.y);
        centerCoords = getPosition(mySVG); //console.log("centerCoords.x: " + centerCoords.x);
        svgCoords = getPosition(mySVG);
        //@ts-ignore
        screenCenter = centerCoords.x + (mySVG.offsetWidth / 2); //console.log("screenCenter: " + screenCenter);
        //@ts-ignore
        caretPos = caretCoords.x + emailCoords.x; //console.log("caretPos: " + caretPos);

        dFromC = screenCenter - caretPos; //console.log("dFromC: " + dFromC);
        var pFromC = Math.round((caretPos / screenCenter) * 100) / 100;
        if (pFromC < 1) {

        } else if (pFromC > 1) {
            pFromC -= 2;
            pFromC = Math.abs(pFromC);
        }

        eyeDistH = -dFromC * 0.05;
        if (eyeDistH > eyeMaxHorizD) {
            eyeDistH = eyeMaxHorizD;
        } else if (eyeDistH < -eyeMaxHorizD) {
            eyeDistH = -eyeMaxHorizD;
        }

        var eyeLCoords = {
            x: svgCoords.x + 84,
            y: svgCoords.y + 76
        };
        var eyeRCoords = {
            x: svgCoords.x + 113,
            y: svgCoords.y + 76
        };
        var noseCoords = {
            x: svgCoords.x + 97,
            y: svgCoords.y + 81
        };
        var mouthCoords = {
            x: svgCoords.x + 100,
            y: svgCoords.y + 100
        };
        //@ts-ignore
        var eyeLAngle = getAngle(eyeLCoords.x, eyeLCoords.y, emailCoords.x + caretCoords.x, emailCoords.y + 25);
        var eyeLX = Math.cos(eyeLAngle) * eyeMaxHorizD;
        var eyeLY = Math.sin(eyeLAngle) * eyeMaxVertD;
        //@ts-ignore
        var eyeRAngle = getAngle(eyeRCoords.x, eyeRCoords.y, emailCoords.x + caretCoords.x, emailCoords.y + 25);
        var eyeRX = Math.cos(eyeRAngle) * eyeMaxHorizD;
        var eyeRY = Math.sin(eyeRAngle) * eyeMaxVertD;
        //@ts-ignore
        var noseAngle = getAngle(noseCoords.x, noseCoords.y, emailCoords.x + caretCoords.x, emailCoords.y + 25);
        var noseX = Math.cos(noseAngle) * noseMaxHorizD;
        var noseY = Math.sin(noseAngle) * noseMaxVertD;
        //@ts-ignore
        var mouthAngle = getAngle(mouthCoords.x, mouthCoords.y, emailCoords.x + caretCoords.x, emailCoords.y + 25);
        var mouthX = Math.cos(mouthAngle) * noseMaxHorizD;
        var mouthY = Math.sin(mouthAngle) * noseMaxVertD;
        var mouthR = Math.cos(mouthAngle) * 6;
        var chinX = mouthX * 0.8;
        var chinY = mouthY * 0.5;
        var chinS = 1 - ((dFromC * 0.15) / 100);
        if (chinS > 1) {
            chinS = 1 - (chinS - 1);
        }
        var faceX = mouthX * 0.3;
        var faceY = mouthY * 0.4;
        var faceSkew = Math.cos(mouthAngle) * 5;
        var eyebrowSkew = Math.cos(mouthAngle) * 25;
        var outerEarX = Math.cos(mouthAngle) * 4;
        var outerEarY = Math.cos(mouthAngle) * 5;
        var hairX = Math.cos(mouthAngle) * 6;
        var hairS = 1.2;
        //@ts-ignore
        TweenMax.to(eyeL, 1, {
            x: -eyeLX,
            y: -eyeLY,
            //@ts-ignore
            ease: Expo.easeOut
        });
        //@ts-ignore
        TweenMax.to(eyeR, 1, {
            x: -eyeRX,
            y: -eyeRY,
            //@ts-ignore
            ease: Expo.easeOut
        });
        //@ts-ignore
        TweenMax.to(nose, 1, {
            x: -noseX,
            y: -noseY,
            rotation: mouthR,
            transformOrigin: "center center",
            //@ts-ignore
            ease: Expo.easeOut
        });
        //@ts-ignore
        TweenMax.to(mouth, 1, {
            x: -mouthX,
            y: -mouthY,
            rotation: mouthR,
            transformOrigin: "center center",
            //@ts-ignore
            ease: Expo.easeOut
        });
        //@ts-ignore
        TweenMax.to(chin, 1, {
            x: -chinX,
            y: -chinY,
            scaleY: chinS,
            //@ts-ignore
            ease: Expo.easeOut
        });
        //@ts-ignore
        TweenMax.to(face, 1, {
            x: -faceX,
            y: -faceY,
            skewX: -faceSkew,
            transformOrigin: "center top",
            //@ts-ignore
            ease: Expo.easeOut
        });
        //@ts-ignore
        TweenMax.to(eyebrow, 1, {
            x: -faceX,
            y: -faceY,
            skewX: -eyebrowSkew,
            transformOrigin: "center top",
            //@ts-ignore
            ease: Expo.easeOut
        });
        //@ts-ignore
        TweenMax.to(outerEarL, 1, {
            x: outerEarX,
            y: -outerEarY,
            //@ts-ignore
            ease: Expo.easeOut
        });
        //@ts-ignore
        TweenMax.to(outerEarR, 1, {
            x: outerEarX,
            y: outerEarY,
            //@ts-ignore
            ease: Expo.easeOut
        });
        //@ts-ignore
        TweenMax.to(earHairL, 1, {
            x: -outerEarX,
            y: -outerEarY,
            //@ts-ignore
            ease: Expo.easeOut
        });
        //@ts-ignore
        TweenMax.to(earHairR, 1, {
            x: -outerEarX,
            y: outerEarY,
            //@ts-ignore
            ease: Expo.easeOut
        });
        //@ts-ignore
        TweenMax.to(hair, 1, {
            x: hairX,
            scaleY: hairS,
            transformOrigin: "center bottom",
            //@ts-ignore
            ease: Expo.easeOut
        });

        document.body.removeChild(div);
    }

    function onEmailFocus(e) {
        e.target.parentElement.classList.add("focusWithText");
        //@ts-ignore
        getCoord();
    }

    function onEmailBlur(e) {
        if (e.target.value == "") {
            e.target.parentElement.classList.remove("focusWithText");
        }
        resetFace();
    }

    function onPasswordFocus(e) {
        coverEyes();
    }

    function onPasswordBlur(e) {
        uncoverEyes();
    }

    function coverEyes() {
        //@ts-ignore
        TweenMax.to(armL, 0.45, {
            x: -93,
            y: 2,
            rotation: 0,
            //@ts-ignore
            ease: Quad.easeOut
        });
        //@ts-ignore
        TweenMax.to(armR, 0.45, {
            x: -93,
            y: 2,
            rotation: 0,
            //@ts-ignore
            ease: Quad.easeOut,
            delay: 0.1
        });
    }

    function uncoverEyes() {
        //@ts-ignore
        TweenMax.to(armL, 1.35, {
            y: 220,
            //@ts-ignore
            ease: Quad.easeOut
        });
        //@ts-ignore
        TweenMax.to(armL, 1.35, {
            rotation: 105,
            //@ts-ignore
            ease: Quad.easeOut,
            delay: 0.1
        });
        //@ts-ignore
        TweenMax.to(armR, 1.35, {
            y: 220,
            //@ts-ignore
            ease: Quad.easeOut
        });
        //@ts-ignore
        TweenMax.to(armR, 1.35, {
            rotation: -105,
            //@ts-ignore
            ease: Quad.easeOut,
            delay: 0.1
        });
    }

    function resetFace() {
        //@ts-ignore
        TweenMax.to([eyeL, eyeR], 1, {
            x: 0,
            y: 0,
            //@ts-ignore
            ease: Expo.easeOut
        });
        //@ts-ignore
        TweenMax.to(nose, 1, {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            //@ts-ignore
            ease: Expo.easeOut
        });
        //@ts-ignore
        TweenMax.to(mouth, 1, {
            x: 0,
            y: 0,
            rotation: 0,
            //@ts-ignore
            ease: Expo.easeOut
        });
        //@ts-ignore
        TweenMax.to(chin, 1, {
            x: 0,
            y: 0,
            scaleY: 1,
            //@ts-ignore
            ease: Expo.easeOut
        });
        //@ts-ignore
        TweenMax.to([face, eyebrow], 1, {
            x: 0,
            y: 0,
            skewX: 0,
            //@ts-ignore
            ease: Expo.easeOut
        });
        //@ts-ignore
        TweenMax.to([outerEarL, outerEarR, earHairL, earHairR, hair], 1, {
            x: 0,
            y: 0,
            scaleY: 1,
            //@ts-ignore
            ease: Expo.easeOut
        });
    }

    function getAngle(x1, y1, x2, y2) {
        var angle = Math.atan2(y1 - y2, x1 - x2);
        return angle;
    }

    function getPosition(el) {
        var xPos = 0;
        var yPos = 0;

        while (el) {
            if (el.tagName == "BODY") {
                // deal with browser quirks with body/window/document and page scroll
                var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
                var yScroll = el.scrollTop || document.documentElement.scrollTop;

                xPos += (el.offsetLeft - xScroll + el.clientLeft);
                yPos += (el.offsetTop - yScroll + el.clientTop);
            } else {
                // for all other non-BODY elements
                xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
                yPos += (el.offsetTop - el.scrollTop + el.clientTop);
            }

            el = el.offsetParent;
        }
        return {
            x: xPos,
            y: yPos
        };
    }

    lemail.addEventListener('focus', onEmailFocus);
    lemail.addEventListener('blur', onEmailBlur);
    lemail.addEventListener('input', onEmailFocus);
   /* lpassword.addEventListener('focus', onPasswordFocus);
    lpassword.addEventListener('blur', onPasswordBlur); */
    //@ts-ignore
    TweenMax.set(armL, {
        x: -93,
        y: 220,
        rotation: 105,
        transformOrigin: "top left"
    });
    //@ts-ignore
    TweenMax.set(armR, {
        x: -93,
        y: 220,
        rotation: -105,
        transformOrigin: "top right"
    });
}

function toggleShowingPassword() {
    if ($$('input[name=signin_password]').attr('type') === 'password') {
        $$('input[name=signin_password]').attr('type', 'text');
    } else {
        $$('input[name=signin_password]').attr('type', 'password');
    }
}
/* === End Signin Yeti === */