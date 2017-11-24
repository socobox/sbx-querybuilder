

(function () {

  var QueryBuilder = (function () {

    var QueryBuilder = function () {

      var self = this;

      var q = { page: 1, size: 1000, where: [] };

      var group = {
        "ANDOR": "AND",
        "GROUP": []
      };

      var OP = ["in", "IN", "not in", "NOT IN", "is", "IS", "is not", "IS NOT", "<>", "!=", "=", "<", "<=", ">=", ">", "like", "LIKE"];

      self.setDomain = function (domainId) {
        q.domain = domainId;
        return self;
      }

      self.setModel = function (modelName) {
        q.row_model = modelName;
        return self;
      }

      self.setPage = function (page) {
        q.page = page;
        return self;
      }

      self.setPageSize = function (pageSize) {
        q.size = pageSize;
        return self;
      }
      
      self.orderBy = function (field, asc) {
        if(!asc){
          asc=false;
        }
        q.order_by = {};
        q.order_by.ASC = asc;
        q.order_by.FIELD = field
        return self;
      }

      self.fetchModels = function (arrayOfModelNames) {
        q.fetch = arrayOfModelNames;
        return self;
      }

      self.addObjectArray = function (array) {

        // prevent non array items to be addded.
        if (Array && !Array.isArray(array)) {
          return;
        }


        q.where = null;

        if (!q.rows) {
          q.rows = [];
        }

        q.rows = q.rows.concat(array);
        return self;
      }

      self.addObject = function (object) {
        q.where = null;

        if (!q.rows) {
          q.rows = [];
        }

        q.rows.push(object);
        return self;
      }

      self.whereWithKeys = function (keysArray) {
        q.where = { keys: keysArray };
        return self;
      }

      self.newGroup = function (connectorANDorOR) {

        q.rows = null;

        // override array where
        if (!Array.isArray(q.where)) {
          q.where = [];
        }

        if (group.GROUP.length > 0) {
          q.where.push(group);
        }


        group = {
          "ANDOR": connectorANDorOR,
          "GROUP": []
        };

        return self;
      }

      self.setReferenceJoin = function (operator, filter_field, reference_field, model, value) {
        q.reference_join = {
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
        if (!Array.isArray(q.where)) {
          q.where = [];
        }

        // first connector is ALWAYS AND
        if (group.GROUP.length < 1) {
          connectorANDorOR = "AND";
        }

        // allow only letters and '.' in the fields.
        if (/^[a-zA-Z0-9\._-]+$/.test(fieldName) == false) {
          throw new Error("Invalid FIELD NAME: " + fieldName)
        }

        // check if the user is using valid operators.
        if (OP.indexOf(operator) < 0) {
          throw new Error("Invalid operator: " + operator)
        }

        if (value === undefined) {
          throw new Error("Invalid value: " + value);
        }

        group.GROUP.push({
          "ANDOR": connectorANDorOR,
          "FIELD": fieldName,
          "OP": operator,
          "VAL": value
        });

        return self;
      }

      self.compile = function () {

        if (q.where) {
          delete q.rows;

          if (Array.isArray(q.where) && group.GROUP.length > 0) {
            q.where.push(group);
          }
        } else if (q.rows) {
          delete q.where;
          if (q.order_by){
            delete q.order_by;
          }
        }

        return q;
      }

    };

    return QueryBuilder;
  })();

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = QueryBuilder;
  else {

    var global;
    try {
      global = Function('return this')() || (42, eval)('this');
    } catch (e) {
      global = window;
    }

    global.QueryBuilder = QueryBuilder;

  }



})();
