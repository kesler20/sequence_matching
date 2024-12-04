% !!!!!!!!!! CALCULATES SAME l/l100 AS PYTHON SCRIPT !!!!!!!!!!!!!!!!!!!!!!
% !!!!!!!!!! VERSION 11 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
% !!!!!!!!!! UP TO CREATE SINGLE ARRAY BLOCK !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
% !!!!!!!!!! RETURN IS USED TO STOP PRIOR TO THIS !!!!!!!!!!!!!!!!!!!!!!!!!

close all;
clear;

last = 4172; % set last scan position12
scans = 1; % number of scans
which = 1;

Filename1 = 'C:\Users\CBE-User-02\Documents\MATLAB2\Caroline\newscans_11/CSP-norm_T1_1-20.png';
name1  = extractAfter(string(Filename1),'Screenshot_');
name1  = extractBefore(string(name1),'.png'); % extract file1 name for labelling

%% ===== AUTO CROP =========================================================
A2 = imread(Filename1); % [NEW SCAN]
A = im2double(A2);
a2 = sum(A,3);

% for i = 1:size(a2,1)-26
% 
%     c1(i+13) = sum(sum(a2(i:i+25,:)))/3/size(a2,2)/26;
% 
% end
% 
% white = find(c1==1);
% top = white;
% top(top>(size(a2,1)/2))=[];
% bottom = white;
% bottom(bottom<(size(a2,1)/2))=[];
% top2 = max(top);
% bottom2 = min(bottom);

[rows, cols] = size(a2);

for i = 1:(rows - 26)
    c1(i + 13) = sum(sum(a2(i:i + 24, :))) / 3 / cols / 25;
end

white = find(c1 == 1);
top = white(white < floor(rows / 2));
top = top(top < 700);
bottom = white(white >= floor(rows / 2));
bottom = bottom(bottom > rows * 0.75);

if isempty(top)
    top2 = [];
else
    top2 = max(top);
end

if isempty(bottom)
    bottom2 = [];
else
    bottom2 = min(bottom);
end

A = A2(top2:bottom2,:,:);



%% READ IN DATA, seperate and convert to greyscale
% 
for k = 1:scans

C1 = im2double(A(:,:,1)); % RED channel to number 0-1
C2 = im2double(A(:,:,2)); % GREEN channel to number 0-1
C3 = im2double(A(:,:,3)); % BLUE channel to number 0-1

C4 = (C1+C2+C3)/3; % turn to grey scale matrix


%% sort into row positions

C5 = C4(:,1:end); % copy C4
C5(C5<1)=0; % turn from greyscale to blacks(0) and whites(1)

mask = [1 1 1 1 1 1 1;1 0 0 0 0 0 1;1 1 1 1 1 1 1]; % create mask to find dashes

[C5y, C5x] = size(C5); % find size of matrix C5

for i = 1:C5x-6 % apply mask to the binary image C5 to find differences
    for j = 1:C5y-2

        t(j,i) = sum(sum(abs(C5(j:j+2,i:i+6)-mask)));

    end
end

t2 = abs(t); % convert minus values to positives
t2(t2>0)=1; % convert all non-zero values to 1

t3 = sum(t2'); % find spikes where horizontal dashes are present

[index, val] = find(t3<C5x-6); % locate the pixels where horizontal dashes are present
border = val+1; % adjust by +1 to give real boundary positions

% get calibration values from grid
scal1 = diff(find(sum(t2)<size(t2,1))); % find location of dashes across the sheet
scal1(scal1<mean(scal1)) = []; % remove readings smaller than the mean (usually low values 0, 1 etc)
scal2 = max(scal1); % use the maximum difference as benchmark for cell sizes across the sheet

scal3 = diff(find(sum(t2')<size(t2,2))); % calculate gaps between rows down the sheet

border(2,:) = [round((diff(border(1,:))-42)/22) 0]; % calculate the number of bars in each row


%% show plots

% figure
% imshow(A) % show the source (cropped) image

tic % start timimg

found_bar = 1; % set found bar counter to 1
pixel_check = 10; % set subsequent pixels to check value
new = 1; % set new bar found value to ON[1], turns OFF[0]

%% ===== START SEARCH LOOP =====

for i = 2:size(C1,1)-1 % iterate down
for j = 2:size(C1,2)-10 % iterate across %%%!!!! MIGHT NEED TO AUTOMATE THIS -10 VALUE (MARGIN WIDTH)
    %if C4(i-1,j) == 1 % <<<<<<<<<<<<<<<<<<<<<<<<<<<<NEW ON
    % if mean of next 5 pixels is less that 0.05 (in other words almost
    % black) AND the previous pixel is less than 0.15 (almost black) AND
    % the new bar find condition is switched ON
    if mean(C1(i,j:j+10)) < 0.05 && C1(i,j-1) < 0.4 && new == 1
     % mean(C1(i,j:j+5)) == 0 && C1(i,j-1) == 0 && new == 1
        
        l(found_bar,1:2) = [i j-1]; % record y-position and x-position of new bar
        l(found_bar,5) = C1(i+1,j+1); % record [R]GB of bar
        l(found_bar,6) = C2(i+1,j+1); % record R[G]B of bar
        l(found_bar,7) = C3(i+1,j+1); % record RG[B] of bar
        new = 0; % turn OFF the new bar find condition
    
    % if black bar is present but the bar is not a new find 
    elseif mean(C1(i,j:j+10)) < 0.05 && C1(i,j-1) < 0.4 && new == 0 
         % mean(C1(i,j:j+5)) == 0 && C1(i,j-1) == 0 && new == 0    
        
        pixel_check = pixel_check+1; % add a pixel to length of the found bar
        
    % if no black bar is found and the last pixel is not black 
    elseif mean(C1(i,j:j+10)) >= 0.05 && C1(i,j-1) >=0.4 && new == 0 
         % mean(C1(i,j:j+5)) ~= 0 && C1(i,j-1) == 0 && new == 0 
        
        % if out of border region
        l(found_bar,3) = pixel_check; % record bar length 
        pixel_check = 11; % reset pixel check value
        new = 1; % activate search for new bar
        found_bar = found_bar + 1; % set index to record next bar
 
    end
    %end %<<<<<<<<<<<<<<<<<<<<<<<<<<<<NEW ON


end

w = waitbar(i/size(C1,1)); % update progress bar
end
delete(w) % delete progress bar when finished

l(:,4) = round(l(:,3)/scal2); % change bar length pix to blocks % **********
%l(:,4) = round(l(:,3)/25); % change bar length pix to blocks 

%% Remove searched that are white, leaving only colous

for i = 1:size(l,1)
   
    if sum(l(i,5:7)) == 3 % if (R + G + B = 1) then white
        l(i,:) = nan;
    end
    
end
l(isnan(l))=[]; % remove the nans (turns to an array)
l = reshape(l,length(l)/7,7); % reshape to form back into matrix % <<<<<<<<<<<<<<<<< NEW OFF

toc % end timer

%% print out the reconstruction

figure(3)
for i = 1:size(l,1)

    rectangle('Position',[round(l(i,2)/scal2) (l(i,1)) l(i,4) 20],... % ********** 
        'FaceColor',[l(i,5) l(i,6) l(i,7)],'EdgeColor','k',...
        'LineWidth',0.5)
    hold on
    
end
set(gca, 'YDir','reverse')
xlim([0 51])

un_rows = unique(l(:,1));

%% position bars in from the top (column 8)

for i = 2:size(l,1)

    l(1,8) = 0; % start first bar at position ZERO
    
    if l(i,1) - l(i-1,1) > 30 || l(i,1) - l(i-1,1) == 0 && l(i-1,8) == 0
        l(i,8) = 0;
        % set position to be ZERO
    else
        % check if new bar is one the same row but not level ZERO
        if l(i,1) - l(i-1,1) == 0
        l(i,8) = l(i-1,8);
        else
        l(i,8) = l(i-1,8)+1;
        end
        % otherwise add a row to position
    end

end

%% create index for each bar in terms of sequence position rather than pixels
index = [];
for i = 1:size(l,1)
    
    temp = border(1,:)-l(i,1);
    temp(temp>0)=nan;
    [c(i) index(i)] = max(temp);
    % index: the row of bars that each bar belongs to

end

l(:,9) = (index-1)*50+1; % *********************
l(:,10) = round(l(:,2)/scal2); % ***************************
l(:,11) = l(:,9)+l(:,10);
% transfer bar length
l(:,12) = l(:,4);
% end position of each bar
l(:,13) = l(:,11)+l(:,12)-1;

l(l(:, 12) == 0, :) = [];



%% bar matching

% check if bar is closed

for i = 1:size(l,1) % sum of RGB for last bar (0 if closed [3*black])  
    l(i,14) = (C1(l(i,1)+5,l(i,2)+l(i,3)-0)*3+...
        C2(l(i,1)+5,l(i,2)+l(i,3)-0)*5+...
        C3(l(i,1)+5,l(i,2)+l(i,3)-0)*7)/105;
end

for i = 1:size(l,1) % sum of RGB for first bar (0 if closed [3*black])
    l(i,15) = (C1(l(i,1)+5,l(i,2)-0)*3+...
        C2(l(i,1)+5,l(i,2)-0)*5+...
        C3(l(i,1)+5,l(i,2)-0)*7)/105;
end

% return % !!!!!!!!! CHECK UP TO HERE !!!!!!!!!!!!!!!!!

for i = size(l,1):-1:1 % step backwards through bars to join together
%disp(i)

    if mod(l(i,13),50) == 0 % if a bar is present at the end of page
    
        if sum(l(i:end,11) == l(i,13)+1) > 0 && l(i,14) ~= 0 % if the find isn't the last bar

            check = l(i,14); % record average RGB value

            place = find(l(i:end,15)==check); % find bars at the beggining
                                              % to see which match
            place(l(i+place-1,11)<l(i,13))=[];
            l(i,12) = l(i,12)+l(i+place(end)-1,12);
            l(i,13) = l(i+place(end)-1,13);

            l(i+place(end)-1,:) = [];

        end
    
    end

end

l(:,16) = l(:,13)-l(:,11)+1;
l(:,17) = l(:,16)-l(:,12);

if sum(l(:,13)-l(:,11)-l(:,12)+1) > 0
    disp('PROBLEM! :(')
else
    disp('ALL GOOD! :)')
end


return













%% CREATE SINGLE ARRAY ======================

array1{k}(1:max(l(:,8))+1,1:last) = zeros;
col1{k}(1:(max(l(:,8))+1)*3,1:last) = zeros;

for i = 1:size(l,1)

    array1{k}(l(i,8)+1,l(i,11):l(i,13)) = ones*(l(i,8)+1);
    
    col1{k}( ((l(i,8)+1)*3)-2:(l(i,8)+1)*3 , l(i,11) : l(i,13) )...
        = l(i,5:7)' .* ones( size(col1{k}( ((l(i,8)+1)*3)-2:(l(i,8)+1)*3 , l(i,11) : l(i,13) )) );
    

end

array1{k}(array1{k}==0) = nan;

l2{k} = l;
clearvars -except l2 array1 col1 last name1 name2 scans



end

%% plot comparisons 2ND SCANS!!!===============

mpos = last;

a1 = zeros(1,mpos);
a1(1:size(array1{1},2)) = tsnansum(array1{1,1});
a1(a1>0)=1;
colorID = ones(length(a1),3)*0.2;     % default is black
colorID(a1 == 1,:) = repmat([1 0.75 0],size(colorID(a1 == 1,:),1),1); %yellow

if scans == 2
a2 = zeros(1,mpos);
a2(1:size(array1{2},2)) = tsnansum(array1{1,2});
a2(a2>0)=2;
a3 = a1+a2;

% build color ID for comparing two scans (1=a1 and 2=a2, 1+2=a3)
colorID = ones(length(a3),3)*0.2;     % default is black
colorID(a3 == 1,:) = repmat([1 0.75 0],size(colorID(a3 == 1,:),1),1); %yellow
colorID(a3 == 2,:) = repmat([0.36 0.61 0.84],size(colorID(a3 == 2,:),1),1); %blue
colorID(a3 == 3,:) = repmat([0.78 0.35 0.06],size(colorID(a3 == 3,:),1),1); %blue
end

if scans == 3
a2 = zeros(1,mpos);
a2(1:size(array1{2},2)) = tsnansum(array1{1,2});
a2(a2>0)=2;
a2b = zeros(1,mpos);
a2b(1:size(array1{3},2)) = tsnansum(array1{1,3});
a2b(a2b>0)=4;
a3 = a1 + a2 + a2b;



% build color ID for comparing two scans (1=a1 and 2=a2, 1+2=a3)
colorID = ones(length(a3),3)*0.2;     % default is black

colorID(a3 == 1,:) = repmat([0.62 0.11 0.13],      size(colorID(a3 == 1,:),1),1); % just1: red
colorID(a3 == 2,:) = repmat([0.10 0.67 0.29],size(colorID(a3 == 2,:),1),1);       % just2: green
colorID(a3 == 4,:) = repmat([0.96 0.73 0.09],      size(colorID(a3 == 4,:),1),1); % just3: yellow

colorID(a3 == 3,:) = repmat([0.22 0.33 0.65],size(colorID(a3 == 3,:),1),1);       % 1&2: blue
colorID(a3 == 5,:) = repmat([0.22 0.33 0.65],size(colorID(a3 == 5,:),1),1);       % 1&3: blue
colorID(a3 == 6,:) = repmat([0.22 0.33 0.65],size(colorID(a3 == 6,:),1),1);       % 2&3: blue

colorID(a3 == 7,:) = repmat([0.22 0.33 0.65],size(colorID(a3 == 7,:),1),1);       % 1&2&3: blue
end




%% USE COLOUR CODING TO ASSESS CONFIDENCE =================================


for k = 1:scans
    con{k} = zeros(size(col1{k},1)/3,mpos);
for i = 1:3:size(col1{k},1)
for j = 1:size(col1{k},2)
    
    if round(sum(col1{k}(i:i+2,j).*[3;5;7])*10000) == 90235
        con{k}((i+2)/3,j) = 0.75;
    elseif round(sum(col1{k}(i:i+2,j).*[3;5;7])*10000) == 102784
        con{k}((i+2)/3,j) = 0.35;
    elseif round(sum(col1{k}(i:i+2,j).*[3;5;7])*10000) == 115137
        con{k}((i+2)/3,j) = 0.15;
    elseif round(sum(col1{k}(i:i+2,j).*[3;5;7])*10000) == 100196
        con{k}((i+2)/3,j) = 0.075;
    elseif round(sum(col1{k}(i:i+2,j).*[3;5;7])*10000) == 135059
        con{k}((i+2)/3,j) = 0.035;
    elseif round(sum(col1{k}(i:i+2,j).*[3;5;7])*10000) == 116431
        con{k}((i+2)/3,j) = 0.015;
 
    elseif round(sum(col1{k}(i:i+2,j).*[3;5;7])*10000) == 94118
        con{k}((i+2)/3,j) = 0.0075;
    elseif round(sum(col1{k}(i:i+2,j).*[3;5;7])*10000) == 112941
        con{k}((i+2)/3,j) = 0.0035;
    elseif round(sum(col1{k}(i:i+2,j).*[3;5;7])*10000) == 132000
        con{k}((i+2)/3,j) = 0.0015;
    elseif round(sum(col1{k}(i:i+2,j).*[3;5;7])*10000) == 150000
        con{k}((i+2)/3,j) = 0.0005;

    end

end
end
end % 'con' is a matrix containing the significance values for each found bar


con2{1} = sum(con{1});
con3 = con2{1}/max(con2{1});
if scans >= 2
con2{2} = sum(con{2});
con3 = con2{1}+con2{2};
end
con3 = con3/max(con3);

% collate 'k' confidence arrays into one array (con3)

con3 = zeros(1,mpos);
for k = 1:scans

    con2{k} = sum(con{k});
    con3 = con3 + con2{k};
end
con3 = con3/max(con3);


%% plot results

figure(12)

for k = 1:scans
for i = 1:max(l2{k}(:,8))+1

    scatter(linspace(1,length(array1{k}),length(array1{k})),array1{k}(i,:)+(10*k),[],col1{k}(i*3-2:i*3,:)','filled','square')
    hold on

end
end

pa1 = rectangle('Position', [1, 1, mpos, 17], ...
                'FaceColor', [1, 0, 0, 0.1], ...
                'EdgeColor', [1, 0, 0, 0.0]);
            uistack(pa1,'bottom')
name1 = regexprep(name1, '_', ' ');
text(100,16,name1)

if scans >= 2
pa2 = rectangle('Position', [1, 18, mpos, 15], ...
                'FaceColor', [0, 0, 1, 0.1], ...
                'EdgeColor', [0, 0, 1, 0.0]);
            uistack(pa2,'bottom')            
name2 = regexprep(name2, '_', ' ');
text(100,31,name2)
end

set(gca,'Ytick',[],'YTickLabel',[]);
set(gca, 'YDir','reverse')
xlabel('Position')
% xlim([1 last])
xlim([1 mpos])


for i = 1:mpos
scatter(i,36,[],colorID(i,:),'filled','square','MarkerFaceAlpha',con3(i));
hold on
end

pa3 = rectangle('Position', [1, 33, mpos, 13], ...
                'FaceColor', [0.5, 0.5, 0.5, 0.2], ...
                'EdgeColor', [0.5, 0.5, 0.5, 0.0]);
            uistack(pa3,'bottom')    



if scans == 2
text(100,38,['eGFP MazF ',num2str(round(numel(a1(a1>0))/mpos*100)),'%'],'color',[1 0.75 0])
text(100,40,['eGFP T1 ',num2str(round(numel(a2(a2>0))/mpos*100)),'%'],'color',[0.36 0.61 0.84])
text(100,42,['eGFP T1 + eGFP MazF ',num2str(round(numel(a3(a3>0))/mpos*100)),'%'],'color',[0.78 0.35 0.06])
text(100,44,['No coverage ',num2str(round(numel(a3(a3==0))/mpos*100)),'%'],'color',[0.2 0.2 0.2])

elseif scans == 3
    
    text(100,38,['10 mins: ',num2str(round(numel(a1(a1>0))/mpos*100)),'%'],'color',[0.62 0.11 0.13]); % just1: red
    text(100,40,['15 mins: ',num2str(round(numel(a2(a2>0))/mpos*100)),'%'],'color',[0.10 0.67 0.29]); % just2: green
    text(100,42,['20 mins: ',num2str(round(numel(a2b(a2b>0))/mpos*100)),'%'],'color',[0.96 0.73 0.09]); % just3: yellow
    text(100,44,['Combined: ',num2str(round(numel(a3(a3>0))/mpos*100)),'%'],'color',[0.22 0.33 0.65]); % 1&2&3: blue
    text(100,46,['No coverage ',num2str(round(numel(a3(a3==0))/mpos*100)),'%'],'color',[0.2 0.2 0.2])

end
ylim([10 46])

set(gcf,'position',[100 100 1800 400])
% print(figure(10),'Output','-djpeg', '-r300'); %<-Save as PNG with 300 DPI


% a5 = [0 diff(a3)];
% 
% a6 = [1 find(abs(a5)>0)-1];
% a7 = [a6(2:end) mpos];
% a8 = a3(a6+1);
% 
% a8(a8==1)=8;
% a8(a8==0)=20;
% a8(a8==2)=1;
% a8(a8==3)=4;
% 
% a9 = [a6;a7;a8]';


%% ==== spiral plots ===================== 
t = linspace(10*pi,(mpos*0.01+10)*pi,mpos);
con4 = (con3*100)+10;
con5 = (con3+1)/max(con3+1);
figure
hold on


for i = 1:20:181
    sstart = i;
    send = i+floor(mpos/200)*200;
    if send > last
        send = send-200;
    end
    sinner = 1.0;
    souter = 1.0;
line([ t(sstart).*cos(t(sstart))*sinner t(send).*cos(t(send))*souter],...
    [ t(sstart).*sin(t(sstart))*sinner t(send).*sin(t(send))*souter],'color',[0.8 0.8 0.8],'linewidth',1)

if sstart > 1 && sstart < 101
    text( t(send).*cos(t(send))*souter*1.05, t(send).*sin(t(send))*souter*1.05, num2str(i),'HorizontalAlignment','center')
elseif sstart > 101 && sstart < 201
    text( t(send).*cos(t(send))*souter*1.05, t(send).*sin(t(send))*souter*1.05, num2str(i-100),'HorizontalAlignment','center')
end
end


for i = 1:mpos
scatter(t(i).*cos(t(i)),t(i).*sin(t(i)),con4(i),colorID(i,:),'filled','MarkerFaceAlpha',con5(i))

end
m = sqrt( (t(end)*cos(t(end)))^2 +  (t(end)*sin(t(end)))^2  )*1.1;


scatter( t(1).*cos(t(1)) , t(1).*sin(t(1)) ,60,[0.2 0.2 0.2],'filled')
text(t(1).*cos(t(1)) , t(1).*sin(t(1)) + 3,'Start','fontweight','bold','color',[0.2 0.2 0.2],'Rotation',60)  
for i = 101:100:floor(mpos/100)*100+1
scatter(t(i).*cos(t(i)),t(i).*sin(t(i)),60,[0.2 0.2 0.2],'filled')
if t(1).*cos(t(i)) > 0 
text( t(i).*cos(t(i)) , t(i).*sin(t(i)) + 3 ,num2str(i),'fontweight','bold','color',[0.2 0.2 0.2],'Rotation',60)
else
text( t(i).*cos(t(i)) , t(i).*sin(t(i)) - 3 ,num2str(i),'fontweight','bold','color',[0.2 0.2 0.2],'HorizontalAlignment','right','Rotation',60)
end
end
scatter( t(end).*cos(t(end)) , t(end).*sin(t(end)) ,60,[0.2 0.2 0.2],'filled')
text( t(end).*cos(t(end)) , t(end).*sin(t(end)) - 3 ,['End (',num2str(mpos),')'],'fontweight','bold','color',[0.2 0.2 0.2],'HorizontalAlignment','right','Rotation',60)

axis off equal tight

% if scans >= 2
% text(0,-1.05*m,['eGFP MazF ',num2str(round(numel(a1(a1>0))/mpos*100)),'%'],'color',[1 0.75 0],'HorizontalAlignment','center')
% text(0,-1.15*m,['eGFP T1 ',num2str(round(numel(a2(a2>0))/mpos*100)),'%'],'color',[0.36 0.61 0.84],'HorizontalAlignment','center')
% text(0,-1.25*m,['eGFP T1 + eGFP MazF ',num2str(round(numel(a3(a3>0))/mpos*100)),'%'],'color',[0.78 0.35 0.06],'HorizontalAlignment','center')
% text(0,-1.35*m,['No coverage ',num2str(round(numel(a3(a3==0))/mpos*100)),'%'],'color',[0.2 0.2 0.2],'HorizontalAlignment','center')
% 
% xlim([-m m])
% ylim([-1.5*m m])
% end

set(gcf,'position',[100 100 600 600])
set(gca, 'XDir', 'reverse')
