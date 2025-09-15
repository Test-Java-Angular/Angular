import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageNotFound } from './page-not-found';

describe('PageNotFound', () => {
  let component: PageNotFound;
  let fixture: ComponentFixture<PageNotFound>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageNotFound]
    }).compileComponents();

    fixture = TestBed.createComponent(PageNotFound);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe mostrar un mensaje de página no encontrada', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    // Ajusta la cadena a buscar si tu html contiene otro texto/emojis o estructura.
    expect(compiled.textContent?.toLowerCase()).toContain('no encontrada');
    // O bien busca el texto anglosajón si tu archivo html no está en español
    // expect(compiled.textContent?.toLowerCase()).toContain('not found');
    // O asegúrate de que el mensaje esperado exista
  });
});