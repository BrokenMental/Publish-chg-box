/*
* @param
* - funcAction(json)
* funcOpen: box open 시 동작 함수
* funcClose: box close 시 동작 함수
* funcNotOpen: box 를 열지 못하는 상황에서 실행 될 함수
* optionOneOpen: 선택된 box 외의 box 는 모두 닫힘 처리(boolean, 기본값 false)
*/
const addBoxHeaderClkEvt = (funcAction) => {
    const fOpen = funcAction? funcAction.funcOpen : undefined;
    const fClose = funcAction? funcAction.funcClose : undefined;
    const fAction = funcAction ? funcAction.funcNotOpen : undefined;
    const opOneOpen = funcAction ? funcAction.optionOneOpen : undefined;

    [...document.getElementsByClassName("box-form-header")].forEach(boxH => {
        boxH.onclick = e => {
            const boxRoot = isBoxParent(e.target, "box-form");
            const boxHeader = boxRoot.children[0].children[0];
            const boxBody = boxRoot.children[1];

            if (boxHeader.parentElement.classList.contains('not-open')) {
                if(fAction) {
                    fAction(e);
                }
                return;
            }

            if (boxBody.classList.contains("box-on")) {
                //close
                if(fClose) {
                    fClose(e);
                }

                if(boxHeader.children[1].tagName === 'svg') {
                    boxHeader.removeChild(boxHeader.children[1]);
                    const newI = document.createElement('i');
                    newI.className = 'fa-solid fa-angle-right';
                    boxHeader.appendChild(newI);

                }else {
                    boxHeader.children[1].className = "fa-solid fa-angle-right";
                }

                boxCloseProcess(boxHeader, boxBody);
            } else {
                //open
                if(boxHeader.children[1].tagName === 'svg') {
                    boxHeader.removeChild(boxHeader.children[1]);
                    const newI = document.createElement('i');
                    newI.className = 'fa-solid fa-angle-down';
                    boxHeader.appendChild(newI);

                }else {
                    boxHeader.children[1].className = "fa-solid fa-angle-down";
                }

                //click one list open option, other list close
                if (opOneOpen) {
                    [
                        ...document.getElementsByClassName(
                            "box-form-body box-on"
                        ),
                    ].forEach((boxOn) => {
                        const otherBoxRoot = isBoxParent(boxOn, "box-form");
                        const otherBoxHeader =
                            otherBoxRoot.children[0].children[0];
                        const otherBoxBody = otherBoxRoot.children[1];

                        boxCloseProcess(otherBoxHeader, otherBoxBody);
                    });
                }

                if(fOpen) {
                    fOpen(e);
                }

                boxBody.className = "box-form-body box-on";
                boxHeader.children[1].className = "fa-solid fa-angle-down";
            }
        };
    });
}

const boxCloseProcess = (boxHeader, boxBody) => {
    boxBody.className = 'box-form-body box-off';

    if (boxHeader.children[1].tagName === "svg") {
        boxHeader.removeChild(boxHeader.children[1]);
        const newI = document.createElement("i");
        newI.className = "fa-solid fa-angle-right";
        boxHeader.appendChild(newI);
    } else {
        boxHeader.children[1].className = "fa-solid fa-angle-right";
    }
}

//현재 선택된 타겟의 부모 element 찾기(target: 현재 선택한 element, cn: 찾으려는 className)
const isBoxParent = (target, cn) => {
    let returnElement = target.parentElement;

    if (target.tagName === "BODY" || returnElement.tagName === "BODY") {
        return false;
    }

    if (returnElement.classList.contains(cn)) {
        return returnElement;
    }

    return isBoxParent(returnElement, cn);
};