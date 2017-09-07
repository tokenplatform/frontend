$(document).ready(function() {

  var TokenModel = Backbone.Model.extend({
    defaults: {
      token: "",
      type: "",
      typeLabel: "",
      tokens: 0,
      label: "",
      date: "",
      price: {}
    },
    initialize: function(data) {
      var mappingType = {
        O: 'obligazioni',
        F: 'fidelity points',
        C: 'credits'
      };
      var address = window.ethAddress;
      var me = this;
      me.set('typeLabel', mappingType[data.type]);
      getTokenBalance(address, useToken(data.token))
        .then(function(b) {
          console.log(address, 'balance of', b);
          me.set('tokens', b);
          me.set('total', data.price.value * b);
        });
    }
  });

  var TokenCollection = Backbone.Collection.extend({
    model: TokenModel,
    nextToken: function() {
      return this.last();
    }
  });

  var TokensView = Backbone.View.extend({
    el: $('.js-token-body'),
    tagName:  "li",
    template: _.template("<tr>\
      <td><%= label %></td>\
      <td><%= tokens %></td>\
      <td><%= date %></td>\
      <td><%= typeLabel %></td>\
      <td><%= price.value %> <%= price.currency %></td>\
      <td><%= total %> <%= price.currency %></td>\
    </tr>"),
    render: function() {
      this.$el.append(
        this.template(this.model.toJSON()
      ));
      return this;
    }
  });

  var AppView = Backbone.View.extend({
    initialize: function() {
      this.addToCollection();
    },
    addToCollection: function() {
      this.tokenCollection = new TokenCollection();
      var me = this;

      _.each(presentTokens, function(t) {
        var token = new TokenModel(t);
        me.tokenCollection.add(token);
      });
    },
    render: function() {
      $('.js-token-body').html('');
      this.tokenCollection.each(function(token) {
        var tokenView = new TokensView({
          model: token
        }).render();
      });
    }
  });

  appView = new AppView();
  setTimeout(function(){
    appView.render();
  }, 500);
});
