class Schema {
  constructor(rules) {
    this.rules = rules;
  }

  validate = (payload) => {
    console.log(payload);

    let results = {};

    Object.keys(this.rules).map((name) => {
      let rule = this.rules[name];
      console.log(rule);
      if (typeof rule.validators === "string") {
        rule.validators = [rule.validators];
      }

      rule.validators.map((validator, index) => {

        if (typeof validator === "function") {
          let method = validator(payload[name], rule.message);
          if (!method.validate(payload[name])) {
            if (typeof results[name] === "undefined") {
              results[name] = [];
            }
            results[name].push(method.message);
          }
        }
         else {
          const validatorMethod = this.getValidatorMethod(validator);
          if (this.hasOwnProperty(validatorMethod.name)) {
            console.log("yes" + validatorMethod.name);
            let method = this[validatorMethod.name](
              validatorMethod.extra,
              rule.message
            );
            console.log(this);
            if (!method.validate(payload[name])) {
              if (typeof results[name] === "undefined") {
                results[name] = [];
              }
              results[name].push(method.message);
            }
          } else {
            throw new Error("Unknown validator " + validator);
          }
        }
      });
    });

    return results;
  };

  getValidatorMethod = (validator) => {
    let medthodName, extra;

    if (validator.indexOf(":") >= 0) {
      medthodName = validator.substr(0, validator.indexOf(":"));
      extra = validator.substr(validator.indexOf(":") + 1);
    } else {
      medthodName = validator;
      extra = null;
    }

    return {
      name: medthodName + "Validator",
      extra: extra,
    };
  };

  emailValidator = (extra, message = "Incorrect email") => {
    return {
      validate: (value) => {
        let pattern = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        return !!pattern.test(value);
      },
      message,
    };
  };

  phoneValidator = (extra, message = "Incorrect phone") => {
    return {
      validate: (value) => {
        let pattern = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
        return !!pattern.test(value);
      },
      message,
    };
  };

  urlValidator = (extra, message = "Incorrect url") => {
    return {
      validate: (value) => {
        let pattern = new RegExp(
          "^(https?:\\/\\/)?" + // protocol
            "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
            "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
            "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
            "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
            "(\\#[-a-z\\d_]*)?$",
          "i"
        ); // fragment locator
        return !!pattern.test(value);
      },
      message,
    };
  };

  requiredValidator = (extra, message = "Field is required") => {
    return {
      validate: (value) => {
        return value.length > 0;
      },
      message,
    };
  };

  minValidator = (extra, message = "Incorrect value") => {
    return {
      validate: (value) => {
        return value.length >= extra;
      },
      message: message.replace("{min}", extra),
    };
  };

  maxValidator = (extra, message = "Incorrect value") => {
    return {
      validate: (value) => {
        return value.length <= extra;
      },
      message: message.replace("{max}", extra),
    };
  };
}

export default Schema;
