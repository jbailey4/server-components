var expect = require('chai').expect;

var components = require("../src/index.js");

describe("An asynchronous element", () => {
    it("blocks rendering until they complete", () => {
        var SlowElement = components.newElement();
        SlowElement.createdCallback = function () {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    this.textContent = "loaded!";
                    resolve();
                }, 1);
            });
        };
        components.registerElement("slow-element", { prototype: SlowElement });

        return components.renderFragment("<slow-element></slow-element>").then((output) => {
            expect(output).to.equal("<slow-element>loaded!</slow-element>");
        });
    });

    it("throw an async error if a component fails to render synchronously", () => {
        var FailingElement = components.newElement();
        FailingElement.createdCallback = () => { throw new Error(); };
        components.registerElement("failing-element", { prototype: FailingElement });

        return components.renderFragment(
            "<failing-element></failing-element>"
        ).then((output) => {
            throw new Error("Should not successfully render");
        }).catch(() => { /* All good. */ });
    });

    it("throw an async error if a component fails to render asynchronously", () => {
        var FailingElement = components.newElement();
        FailingElement.createdCallback = () => Promise.reject(new Error());
        components.registerElement("failing-element", { prototype: FailingElement });

        return components.renderFragment(
            "<failing-element></failing-element>"
        ).then((output) => {
            throw new Error("Should not successfully render");
        }).catch(() => { /* All good */ });
    });
});
