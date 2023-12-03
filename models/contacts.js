const { Schema, model } = require('mongoose');
const {handleMongooseError, preUpdate} = require('../utils/helpers/handleMongooseError');
const {createContactValidationSchema,
      updateContactValidationSchema,
      contactFavoriteSchema }= require('../utils/validation/contactValidationSchemas')

const contactSchema = new Schema({
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    }
}, 
{ versionKey: false, timestamps: true })

contactSchema.post('save', handleMongooseError );
contactSchema.pre("findOneAndUpdate", preUpdate);
contactSchema.post('findOneAndUpdate', handleMongooseError );

const Contact = model('contact', contactSchema);

const schemas =  {
    createContactValidationSchema,
    updateContactValidationSchema,
    contactFavoriteSchema,
}

module.exports = { 
    Contact,
    schemas
};