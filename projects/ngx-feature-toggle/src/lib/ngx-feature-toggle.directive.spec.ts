import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FeatureToggleDirective } from './ngx-feature-toggle.directive';
import { FeatureToggleProviderComponent } from './ngx-feature-toggle-provider.component';
import { set } from 'feature-toggle-service';

@Component({
  selector: 'kp-container',
  template: `
    <div>
      <div class="feature-toggle-enabled" *featureToggle="'enableFirstText'">
        <p>Feature toggle enabled</p>
        <div
          class="feature-toggle-disabled"
          *featureToggle="'enableSecondText'"
        >
          Feature toggle disabled
        </div>

        <div
          class="feature-toggle-enabled-with-exclamation-mark"
          *featureToggle="'!enableFirstText'"
        >
          Feature toggle disabled since it's enabled and it has <b>!</b> at
          front.
        </div>

        <div
          class="feature-toggle-disabled-with-exclamation-mark"
          *featureToggle="'enableFirstText'"
        >
          Feature toggle enabled since it's disabled and it has <b>!</b> at
          front.
        </div>

        <div
          class="combined-feature-toggles-with-truthly-option"
          *featureToggle="['enableFirstText', '!enableSecondText']"
        >
          <p>
            This is a combined condition. It shows if <b>enableFirstText</b> is
            true and <b>enableSecondText</b> is falsy. If both cases are
            correct, then the "featureToggle" is enabled and rendering this
            component.
          </p>
        </div>

        <div
          class="combined-feature-toggles-with-falsy-option"
          *featureToggle="['enableFirstText', 'enableSecondText']"
        >
          <p>
            This is a combined condition, but the content should not be
            rendered. It shows if <b>enableFirstText</b> is and
            <b>enableSecondText</b> are true.
          </p>
        </div>
      </div>
    </div>
  `,
})
class ContainerComponent {}

describe('Component: FeatureToggle', () => {
  let fixture: any;

  beforeEach(async () => {
    set({ enableFirstText: true });

    fixture = TestBed.configureTestingModule({
      declarations: [
        ContainerComponent,
        FeatureToggleDirective,
        FeatureToggleProviderComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).createComponent(ContainerComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    set({ enableFirstText: false });
  });

  describe('When featureToggle is enabled', () => {
    it('should render the component content', () => {
      expect(
        fixture.nativeElement.querySelector('.feature-toggle-enabled').innerText
      ).toContain('Feature toggle enabled');
    });

    it('should NOT render the component content if feature toggle is enabled and it contains `!` as first string', () => {
      expect(
        fixture.nativeElement.querySelector(
          '.feature-toggle-enabled-with-exclamation-mark'
        )
      ).toEqual(null);
    });
  });

  describe('When featureToggle is disabled', () => {
    it('should NOT render the component content', () => {
      expect(
        fixture.nativeElement.querySelector('.feature-toggle-disabled')
      ).toEqual(null);
    });

    it('should update when feature toggle data change', () => {
      expect(
        fixture.nativeElement.querySelector('.feature-toggle-enabled').innerText
      ).not.toEqual(null);

      set({ enableFirstText: false });
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector('.feature-toggle-enabled')
      ).toEqual(null);
    });

    it('should render the component content if feature toggle is disabled and it contains `!` as first string', () => {
      expect(
        fixture.nativeElement.querySelector(
          '.feature-toggle-disabled-with-exclamation-mark'
        ).innerText
      ).toContain(
        // tslint:disable-next-line: quotemark
        "Feature toggle enabled since it's disabled and it has ! at front"
      );
    });
  });

  describe('When featureToggle receives an array of features', () => {
    it('should render the component content if `enableFirstText` is true and `enableSecondText` is falsy', () => {
      const textContent = fixture.nativeElement.querySelector(
        '.combined-feature-toggles-with-truthly-option'
      ).innerText;

      expect(textContent).toContain(
        // tslint:disable-next-line: max-line-length
        'This is a combined condition. It shows if enableFirstText is true and enableSecondText is falsy. If both cases are correct, then the "featureToggle" is enabled and rendering this component.'
      );
    });

    it('should NOT render the component content if `enableFirstText` and `enableSecondText` are not truthly', () => {
      expect(
        fixture.nativeElement.querySelector(
          '.combined-feature-toggles-with-falsy-option'
        )
      ).toEqual(null);
    });
  });
});
