<?xml version="1.0" encoding="UTF-8"?>
<xsl:transform xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
	<xsl:template match="/">
		<table id="todoTable" border="1" class="indent">
			<thead>
				<tr>
					<th>Select</th>
					<th>task</th>
					<th>Due</th>
				</tr>
			</thead>
			<tbody>
				<xsl:for-each select="//priority">
					<tr>
						<td colspan="3">
							<xsl:value-of select="@name" />
						</td>
					</tr>
					<xsl:for-each select="task">
						<tr id="{position()}" class="{../@name}">
							<xsl:attribute name="done">
								<xsl:value-of select="boolean(@done)" />
							</xsl:attribute> 
							<td align="center">
								<input name="task0" type="checkbox" />
							</td>
							<td>
								<xsl:value-of select="Description" />
							</td>
							<td align="right">
								<xsl:value-of select="Due" />
							</td>
						</tr>
					</xsl:for-each>
				</xsl:for-each>
			</tbody>
		</table>
	</xsl:template>
</xsl:transform>