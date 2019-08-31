import { BASE_SYMBOL, Field } from './decorators'
import { BaseModel } from './model'

interface ModelMetadata {
  name?: string | Symbol
  fields?: {
    [key: string]: Field
  }
}

export class MetadataStorage {
  private modelClasses: Function[]
  private modelNames: WeakMap<Function, string | Symbol>
  private modelFields: WeakMap<
    Function,
    {
      [key: string]: Field
    }
  >

  constructor() {
    this.modelClasses = []
    this.modelNames = new WeakMap()
    this.modelFields = new WeakMap()
  }

  setModelClass(modelClass: Function, name: string | Symbol) {
    if (name instanceof Symbol && name !== BASE_SYMBOL) {
      throw new Error(`only BaseModel can use Symbol as name`)
    }
    if (this.modelNames.get(modelClass)) {
      throw new Error(`${name} has already been used`)
    }
    this.modelClasses.push(modelClass)
    this.modelNames.set(modelClass, name)
  }

  setModelField(modelClass: Function, field: Field) {
    const fields = this.modelFields.get(modelClass)
    this.modelFields.set(modelClass, {
      ...fields,
      [field.config.name]: field,
    })
  }

  getMetadataByInstance(instance: object) {
    for (let modelClass of this.modelClasses) {
      // TODO: a better way to do this?
      // @ts-ignore
      if (instance.__proto__.constructor === modelClass) {
        return this.getMetadataByClass(modelClass)
      }
    }
  }

  getMetadataByName(name: string | Symbol) {
    for (let modelClass of this.modelClasses) {
      const result = this.getMetadataByClass(modelClass)
      if (name === result.name || name === BASE_SYMBOL) {
        return result
      }
    }
  }

  getMetadataByClass(modelClass: Function): ModelMetadata {
    const name = this.modelNames.get(modelClass)
    const fields = this.modelFields.get(modelClass)
    // TODO: check if modelClass is extended from BaseModel
    const baseFields = this.modelFields.get(BaseModel)
    return {
      name,
      fields: {
        ...baseFields,
        ...fields,
      },
    }
  }
}
