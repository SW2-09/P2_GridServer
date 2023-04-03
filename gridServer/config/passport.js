export {checkPassport}

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'
import { Strategy as localStrategy } from 'passport-local';



//Load Buyer model
import { Buyer } from '../models/Buyer.js';

//Taken from passport website 
function checkPassport(passport) {
    passport.use(
        new localStrategy({usernameField: 'name'}, (name, password, done) =>{
            //Match Buyer
            Buyer.findOne({name: name})
            .then(buyer => {
                if(!buyer){
                    return done(null, false, {msg: 'That name is username is not registrered'});
                }

                //Match password
                bcrypt.compare(password, buyer.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                      return done(null, buyer);
                    } else {
                      return done(null, false, {msg: 'Password incorrect' });
                    }
                  });
            })
            .catch(err => console.log(err));
        })

    )

    //Taken from passport website
    passport.serializeUser((buyer, done) =>{ 
        done(null, buyer.id)
    })

    passport.deserializeUser(async (id, done) => { 
        try {
          const buyer = await Buyer.findById(id);
          done(null, buyer); 
        } catch (err) {
          done(err);
        }
      });
      
}