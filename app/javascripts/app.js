
import "../stylesheets/app.css";

import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'


import voting_artifacts from '../../build/contracts/Voting.json'

var Voting = contract(voting_artifacts);

let candidates = {"Rama": "candidate-1", "Nick": "candidate-2", "Jose": "candidate-3"}

let account

window.voteForCandidate = function(candidate) {
  let candidateName = $("#candidate").val();
  try {
    $("#msg").html("Vote has been submitted. The vote count will increment as soon as the vote is recorded on the blockchain. Please wait.")
    $("#candidate").val("");


    Voting.deployed().then(function(contractInstance) {
      contractInstance.voteForCandidate(candidateName, {gas: 140000, from: account, to:"0x116d56F7f133c772138DAbE46bfBdD91e4ACfA41", value:web3.toWei(10,"Ether")}).then(function() {
        let div_id = candidates[candidateName];
        return contractInstance.totalVotesFor.call(candidateName).then(function(v) {
          $("#" + div_id).html(v.toString());
          $("#msg").html("");
        });
      });
    });
  } catch (err) {
    console.log(err);
  }
}

$( document ).ready(function() {
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source like Metamask")

    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      try {
        // Request account access
        window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
     }
     // Legacy dapp browsers...
     else if (window.web3) {
      web3 = new Web3(window.web3.currentProvider);
     }
     // If no injected web3 instance is detected, fall back to Ganache
     else {
      web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
     }
     //web3 = new Web3(App.web3Provider);
      }
  
    
    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert('There was an error fetching your accounts.')
        return
      }
      if (accs.length === 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
        return
      }
      account = accs[0]
    })
  
  Voting.setProvider(web3.currentProvider);
  let candidateNames = Object.keys(candidates);
  for (var i = 0; i < candidateNames.length; i++) {
    let name = candidateNames[i];
    Voting.deployed().then(function(contractInstance) {
      contractInstance.totalVotesFor.call(name).then(function(v) {
        $("#" + candidates[name]).html(v.toString());
      });
    })
  }
});