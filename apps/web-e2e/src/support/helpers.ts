type AttrName = 'aria-label' | 'data-testid' | 'name' | 'data-loading';

export const select = (attrName: AttrName, attrValue: string) =>
  cy.get(`[${attrName}="${attrValue}"]`);

export const click = (attrName: AttrName, attrValue: string) =>
  select(attrName, attrValue).click();

export const input = (attrValue: string, value: string) =>
  select('name', attrValue).type(value);
