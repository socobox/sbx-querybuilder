

(function() {

  var QueryBuilder = ( function () {

    var QueryBuilder  = function(){

      var self = this;

      self.q = {page: 1, size: 1000, where: []};

      self.group = {
        "ANDOR": "AND",
        "GROUP": []
      };

      self.setDomain = function (domainId) {
        self.q.domain = domainId;
        return self;
      }

      self.setModel = function (modelName) {
        self.q.row_model = modelName;
        return self;
      }

      self.setPage =  function (page) {
        self.q.page = page;
        return self;
      }

      self.setPageSize =  function (pageSize) {
        self.q.size = pageSize;
        return self;
      }

      self.fetchModels  = function (arrayOfModelNames) {
        self.q.fetch = arrayOfModelNames;
        return self;
      }

      self.addObjectArray =  function (array) {

        // prevent non array items to be addded.
        if (Array && !Array.isArray(array)) {
          return;
        }


        self.q.where = null;

        if (!self.q.rows) {
          self.q.rows = [];
        }

        self.q.rows = self.q.rows.concat(array);
        return self;
      }

      self.addObject = function (object) {
        self.q.where = null;

        if (!self.q.rows) {
          self.q.rows = [];
        }

        self.q.rows.push(object);
        return self;
      }

      self. whereWithKeys = function (keysArray) {
        self.q.where = {keys: keysArray};
        return self;
      }

      self.newGroup = function (connectorANDorOR) {

        self.q.rows = null;

        // override array where
        if (!Array.isArray(self.q.where)) {
          self.q.where = [];
        }

        if (self.group.GROUP.length > 0) {
          self.q.where.push(self.group);
        }


        self.group = {
          "ANDOR": connectorANDorOR,
          "GROUP": []
        };

        return self;
      }

      self.setReferenceJoin =  function (operator, filter_field, reference_field, model, value) {
        self.q.reference_join = {
          "row_model": model,
          "filter": {
            "OP": operator,
            "VAL": value,
            "FIELD": filter_field
          },
          "reference_field": reference_field
        }
        return self;
      }

      self.addCondition = function (connectorANDorOR, fieldName, operator, value) {
        // override array where
        if (!Array.isArray(self.q.where)) {
          self.q.where = [];
        }

        // first connector is ALWAYS AND
        if (self.group.GROUP.length < 1) {
          connectorANDorOR = "AND";
        }

        // allow only letters and '.' in the fields.
        if (/^[a-zA-Z0-9\._-]+$/.test(fieldName) == false) {
          throw new Error("Invalid FIELD NAME: " + fieldName)
        }

        // check if the user is using valid operators.
        if (!(operator === "in" || operator === "not in" || operator === "is" || operator === "is not" || operator === "!=" || operator === "=" || operator === "<" || operator === "<=" || operator === ">=" || operator === ">" || operator === "LIKE")) {
          throw new Error("Invalid operator: " + operator)
        }

        if (value === undefined) {
          throw new Error("Invalid value: " + value);
        }

        self.group.GROUP.push({
          "ANDOR": connectorANDorOR,
          "FIELD": fieldName,
          "OP": operator,
          "VAL": value
        });

        return self;
      }

      self.compile = function () {

        if (self.q.where) {
          delete self.q.rows;

          if (Array.isArray(self.q.where) && self.group.GROUP.length > 0) {
            self.q.where.push(self.group);
          }
        } else if (self.q.rows) {
          delete self.q.where;
        }

        return self.q;
      }

    };

    return QueryBuilder;
  })();

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
      module.exports = QueryBuilder;
    else{

      var global;
      try {
        global = Function('return this')() || (42, eval)('this');
      } catch(e) {
        global = window;
      }

      global.QueryBuilder = QueryBuilder;

    }



  })();