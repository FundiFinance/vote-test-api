import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {ethers} from 'ethers';
import {ClaimEvent} from '../models';
import {ClaimEventRepository} from './../repositories';
import abi from './abi';

const ip2proxy = require("ip2proxy-nodejs");
require('dotenv').config();

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const DECIMALS = 18;

@injectable({scope: BindingScope.SINGLETON})
export class ClaimService {
  constructor(@repository(ClaimEventRepository) private claimEventRepository: ClaimEventRepository) {
  }

  /*
   * Add service methods here
   */
  public async claimToken(user: string, ip: string): Promise<object> {
    if (user == ZERO_ADDRESS) {
      return {
        success: false,
        msg: "Address cannot be ZERO"
      }
    }
    const claimEvent = await this.claimEventRepository.findOne({
      where: {
        or: [
          { user: user.toLowerCase() },
          { ip }
        ]
      }
    })
    if (claimEvent) {
      return {
        success: false,
        msg: "Already claimed"
      }
    }
    const provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545/", 97);
    const wallet = (new ethers.Wallet(process.env.CLAIMER || '')).connect(provider);
    const contract = new ethers.Contract(process.env.CONTRACT || '', abi, wallet);
    try {
      const tx = await contract.claim(user);
      const receipt = await tx.wait();
      const newClaimEvent = new ClaimEvent();
      newClaimEvent.user = user.toLowerCase();
      newClaimEvent.ip = ip;
      newClaimEvent.hash = receipt.transactionHash;

      await this.claimEventRepository.create(newClaimEvent)
      return {
        success: true,
        hash: receipt.transactionHash
      }
    } catch (err) {
      return {
        success: false,
        msg: "Unknown"
      }
    }
  }
}
