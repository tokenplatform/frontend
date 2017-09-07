var currentToken;
var appView;
var ethAddress = '0x123';
var ethAddress = '0x6a2d74ac4eaee757e6ab73c918bbfc70a310788b';

var presentTokens = [
  {
    token: '0xd6074d319057a3c5aeb17c17f7176fe56c2b4b0e',
    label: 'TOKEN1',
    date: '2017/08/31',
    type: 'O',
    price: {
      value: 12.0,
      currency: 'CHF'
    }
  },
  {
    token: '0x746f614d86c8904d855d7aba59160049f81b2c2a',
    label: 'TOKEN2',
    date: '2017/08/30',
    type: 'C',
    price: {
      value: 16.4,
      currency: 'USD'
    }
  },
  {
    token: '0xfd134f3cb99debdc1a26e3097a795cdb366edc79',
    label: 'TOKEN2',
    date: '2017/07/21',
    type: 'F',
    price: {
      value: 10.1,
      currency: 'EUR'
    }
  },
  {
    token: '0x72897b3cb265d42098e9e645dd08c0ac059ecd03',
    label: 'TKN3',
    date: '2017/09/03',
    type: 'O',
    price: {
      value: 20,
      currency: 'EUR'
    }
  }
];

$(document).ready(function() {
  var $tokenSelectForTransfer = $('.js-token-select');
  var $tokenAmountForTransfer = $('.js-token-amount');
  var $tokenAddressForTransfer = $('.js-token-address');
  _.each(presentTokens, function(t, i) {
    var template = _.template('<option value="<%= value %>"><%= label %></option>');
    $tokenSelectForTransfer.append(template({
      label: t.label + ' ' + t.token,
      value: t.token
    }))
  });

  $(".js-create-submit").click(function() {
      var supply = $('.js-create-amount').val();
      Token.deploy([supply]).then(function(deployedToken) {
        currentToken = deployedToken;
        $(".js-create-done").append("<br>Token deployed with address: " + deployedToken.address);
        $(".js-create-done").show();
      });
  });

  $('.js-eth-address').html(ethAddress);

  $('.js-transfer-submit').click(function() {
    var address = $tokenAddressForTransfer.val();
    var num = $tokenAmountForTransfer.val();

    if(typeof num !== 'undefined') {
      useToken($tokenSelectForTransfer.val());
      currentToken.transfer(address, num).then(function() {
        $('.js-transfer-done').show();
        appView.addToCollection();

        setTimeout(function(){
          $('.js-transfer-done').hide();
          appView.render();
        }, 2000);
      });
    }
  });
/*
  $('.tokenAddress').click(function(){
    var tokenAddress = $(this).text();
    currentToken = useToken(tokenAddress);
    console.log('TOKEN SET', tokenAddress);
  });

  $('.ethAddress').click(function(){
    ethAddress = $(this).text();
    console.log('---');
    console.log('ADDR SET', ethAddress);
    getAllTokenBalance(ethAddress);
  });
  */

  $('a.nav-link').click(function(){
    var $rel = $(this).attr('rel');
    $('.js-cont').hide();
    $('#'+$rel).show();
    $('.nav-item').removeClass('active');
    $(this).parent().addClass('active');
  })
});

function getTokenBalance(address, injectToken) {
  var _currentToken = currentToken || injectToken;
  var promise = new Promise(function(resolve, reject) {
    _currentToken.balanceOf(address).then(function(balance) {
      var tokenBalance = balance.toString();
      $('#queryBalance .result').html(tokenBalance);
      resolve(tokenBalance);
    });
  });
  return promise;
}

function useToken(tokenAddress) {
  currentToken = new EmbarkJS.Contract({
    abi: Token.abi,
    address: tokenAddress
  });
  return currentToken;
}

function getAllTokenBalance(address) {
  $('.tokenAddress').each(function(e,i) {
    var tok = $(i).text();
    currentToken = useToken(tok);

    getTokenBalance(address)
      .then(function(b) {
        console.log(address, 'balance of', tok, b);
      });
  });
}
