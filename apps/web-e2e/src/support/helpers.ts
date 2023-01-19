type AttrName = 'aria-label' | 'data-testid' | 'name' | 'data-loading';

export const select = (attrName: AttrName, attrValue: string) =>
  cy.get(`[${attrName}="${attrValue}"]`, { timeout: 10_000 });

export const click = (attrName: AttrName, attrValue: string) =>
  select(attrName, attrValue).click({ timeout: 10_000 });

export const input = (attrValue: string, value: string) =>
  select('name', attrValue).type(value);

export const getViewport = () => {
  const dimensions = Cypress.env('VIEWPORT').split('x') as [string, string];
  return {
    width: Number(dimensions[0]),
    height: Number(dimensions[1]),
  };
};
