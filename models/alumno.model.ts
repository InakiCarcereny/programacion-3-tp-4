import { PersonaModel } from "./persona.model";

export class AlumnoModel extends PersonaModel {
  private legajo: number;
  private fechaAlta: string;
  private modificacion: string;
  private isActive: boolean;

  constructor(
    legajo: number,
    nombre: string,
    apellido: string,
    email: string,
    fechaAlta?: string,
    modificacion?: string,
    isActive?: boolean
  ) {
      super(nombre, apellido, email);

      if (!this.validarLegajo(legajo)) {
        throw new Error("El legajo debe ser un número mayor o igual a 10000.");
      }

      this.legajo = legajo;

      const hoy = new Date().toISOString().split('T')[0];

      this.fechaAlta = fechaAlta ?? hoy;
      this.modificacion = modificacion ?? hoy;
      this.isActive = isActive ?? true;
    }

  private validarLegajo(legajo: number): boolean {
    if (legajo < 10000) {
      return false;
    }

    return true;
  }

  public setIsActive(isActive: boolean): void {
    this.isActive = isActive;

    this.modificacion = new Date().toISOString().split('T')[0];
  }

  public getLegajo(): number {
    return this.legajo;
  }

  public getFechaAlta(): string {
    return this.fechaAlta;
  }

  public getModificacion(): string {
    return this.modificacion;
  }

  public getIsActive(): boolean {
    return this.isActive;
  }

  public override getAllAttributes(): {
    nombre: string;
    apellido: string;
    email: string;
    legajo: number;
    fechaAlta: string;
    modificacion: string;
    isActive: boolean;
  } {
      return {
        ...super.getAllAttributes(),
        legajo: this.legajo,
        fechaAlta: this.fechaAlta,
        modificacion: this.modificacion,
        isActive: this.isActive,
    };
  }
}
